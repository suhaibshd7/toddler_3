param(
    [string]$RepositoryUrl = "https://github.com/suhaibshd7/toddler_3.git",
    [string]$Branch = "main",
    [string]$ClonePath = (Join-Path $HOME "Documents\toddler_3")
)

$ErrorActionPreference = "Stop"
$BundleDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-ProjectVersion {
    param([Parameter(Mandatory = $true)][string]$ProjectDir)

    foreach ($relativePath in @("index.html", "css\styles.css", "js\app.js", "js\game-data.js")) {
        if (-not (Test-Path -LiteralPath (Join-Path $ProjectDir $relativePath) -PathType Leaf)) {
            throw "The source package is incomplete. Missing: $relativePath"
        }
    }

    $html = Get-Content -LiteralPath (Join-Path $ProjectDir "index.html") -Raw
    $pattern = '<meta\s+name="application-version"\s+content="(?<version>\d+(?:\.\d+){1,3})"'
    $match = [regex]::Match($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if (-not $match.Success) {
        throw "Could not read application-version from $ProjectDir\index.html. Refusing to import an unversioned package."
    }

    try {
        return [version]($match.Groups["version"].Value)
    }
    catch {
        throw "The application-version value is invalid."
    }
}

function Get-NormalizedFullPath {
    param([Parameter(Mandatory = $true)][string]$Path)
    $fullPath = [System.IO.Path]::GetFullPath($Path)
    $root = [System.IO.Path]::GetPathRoot($fullPath)
    if ($fullPath.Length -gt $root.Length) {
        $fullPath = $fullPath.TrimEnd([char[]]@([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar))
    }
    return $fullPath
}

# Prefer the project root. Older transfer archives may still contain the nested folder.
$legacySourceDir = Join-Path $BundleDir "toddler3-publish"
if (Test-Path -LiteralPath (Join-Path $BundleDir "index.html") -PathType Leaf) {
    $SourceDir = $BundleDir
}
elseif (Test-Path -LiteralPath (Join-Path $legacySourceDir "index.html") -PathType Leaf) {
    $SourceDir = $legacySourceDir
}
else {
    throw "Could not find index.html beside this script or in toddler3-publish. Extract the complete source package first."
}

$SourceVersion = Get-ProjectVersion -ProjectDir $SourceDir
$SourceFullPath = Get-NormalizedFullPath -Path $SourceDir
$CloneFullPath = Get-NormalizedFullPath -Path $ClonePath
$sameSourceAndDestination = $SourceFullPath -eq $CloneFullPath

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is required. Install Git for Windows (or GitHub Desktop), then run this script again."
}

if (Test-Path -LiteralPath (Join-Path $ClonePath ".git")) {
    git -C $ClonePath fetch origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "Could not fetch origin/$Branch." }
    git -C $ClonePath checkout $Branch
    if ($LASTEXITCODE -ne 0) { throw "Could not check out $Branch." }
    git -C $ClonePath pull --ff-only origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "The local clone cannot fast-forward. Resolve its Git changes before retrying." }
}
else {
    if (Test-Path -LiteralPath $ClonePath) {
        $existingItems = @(Get-ChildItem -LiteralPath $ClonePath -Force -ErrorAction SilentlyContinue)
        if ($existingItems.Count -gt 0) {
            throw "The destination exists but is not a Git repository: $ClonePath. Choose an empty ClonePath or move that folder first."
        }
    }
    else {
        $parent = Split-Path -Parent $ClonePath
        if (-not (Test-Path -LiteralPath $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
    }

    git clone --branch $Branch --single-branch $RepositoryUrl $ClonePath
    if ($LASTEXITCODE -ne 0) { throw "Could not clone the repository. Complete GitHub sign-in, then retry." }
}

if (-not (Test-Path -LiteralPath (Join-Path $ClonePath "index.html") -PathType Leaf)) {
    throw "The destination repository has no root index.html. Refusing to import without a version comparison."
}

$DestinationVersion = Get-ProjectVersion -ProjectDir $ClonePath
if ($SourceVersion -lt $DestinationVersion) {
    throw ("OUTDATED PACKAGE — import cancelled. Package version: {0}; repository version: {1}. Download the latest source. No files were copied or committed." -f $SourceVersion, $DestinationVersion)
}

if ($CloneFullPath.StartsWith(
    $SourceFullPath.TrimEnd([char[]]@([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar)) + [System.IO.Path]::DirectorySeparatorChar,
    [System.StringComparison]::OrdinalIgnoreCase
)) {
    throw "ClonePath is inside the source package. Choose a separate destination folder."
}

if (-not $sameSourceAndDestination) {
    Get-ChildItem -LiteralPath $SourceDir -Force |
        Where-Object { $_.Name -ne ".git" } |
        ForEach-Object {
            Copy-Item -LiteralPath $_.FullName -Destination $ClonePath -Recurse -Force
        }
}
else {
    Write-Host "Source and destination are the same folder; skipping the copy."
}

# Remove the stale duplicate project snapshot; the repository root is canonical.
$obsoletePublishDir = Join-Path $ClonePath "toddler3-publish"
if (Test-Path -LiteralPath $obsoletePublishDir) {
    Remove-Item -LiteralPath $obsoletePublishDir -Recurse -Force
}

# Avoid a conflicting Actions workflow when Pages publishes main / (root).
$pagesWorkflow = Join-Path $ClonePath ".github\workflows\pages.yml"
if (Test-Path -LiteralPath $pagesWorkflow) {
    Remove-Item -LiteralPath $pagesWorkflow -Force
}

$userName = git -C $ClonePath config user.name
$userEmail = git -C $ClonePath config user.email
if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
    throw 'Git needs your commit identity. Run git config --global user.name "Your Name" and git config --global user.email "your@email.com", then retry.'
}

git -C $ClonePath add -A
if ($LASTEXITCODE -ne 0) { throw "Git could not stage the project files." }

$status = @(git -C $ClonePath status --porcelain)
if ($LASTEXITCODE -ne 0) { throw "Git could not read the repository status." }

if ($status.Count -eq 0) {
    Write-Host "The repository already matches the v$SourceVersion source; nothing new to commit."
}
else {
    git -C $ClonePath commit -m "Sync Arabic Kitten Game v$SourceVersion"
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
    git -C $ClonePath push origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "Push failed. Complete GitHub sign-in when prompted, then retry." }
}

Write-Host ""
Write-Host "Source version: $SourceVersion"
Write-Host "Project files are in: $ClonePath"
Write-Host "GitHub repository: https://github.com/suhaibshd7/toddler_3"
Write-Host "Pages URL: https://suhaibshd7.github.io/toddler_3/"
Write-Host "Pages settings: Deploy from a branch / main / (root)."
