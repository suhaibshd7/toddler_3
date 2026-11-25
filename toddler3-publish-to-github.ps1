param(
    [string]$RepositoryUrl = "https://github.com/suhaibshd7/toddler_3.git",
    [string]$Branch = "main",
    [string]$ClonePath = (Join-Path $HOME "Documents\toddler_3")
)

$ErrorActionPreference = "Stop"
$BundleDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceDir = Join-Path $BundleDir "toddler3-publish"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is required. Install Git for Windows (or GitHub Desktop, which includes Git), then run this script again."
}
if (-not (Test-Path (Join-Path $SourceDir "index.html"))) {
    throw "Could not find toddler3-publish\index.html. Extract the complete source bundle first, keeping the folder next to this script."
}

if (-not (Test-Path (Join-Path $ClonePath ".git"))) {
    $parent = Split-Path -Parent $ClonePath
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    git clone --branch $Branch --single-branch $RepositoryUrl $ClonePath
    if ($LASTEXITCODE -ne 0) { throw "Could not clone the repository. Sign in to GitHub with Git Credential Manager or GitHub Desktop, then retry." }
} else {
    git -C $ClonePath fetch origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "Could not fetch origin/$Branch." }
    git -C $ClonePath checkout $Branch
    if ($LASTEXITCODE -ne 0) { throw "Could not check out $Branch." }
    git -C $ClonePath pull --ff-only origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "The local clone cannot fast-forward. Resolve its Git changes before retrying." }
}

# Copy the game as ordinary folders/files into the repository root.
Get-ChildItem -LiteralPath $SourceDir -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $ClonePath -Recurse -Force
}

# Ensure no GitHub Actions Pages workflow conflicts with branch-based Pages publishing.
$pagesWorkflow = Join-Path $ClonePath ".github\workflows\pages.yml"
if (Test-Path $pagesWorkflow) { Remove-Item -LiteralPath $pagesWorkflow -Force }

# Set a repository-local identity only when the user's Git config already provides one.
$userName = git -C $ClonePath config user.name
$userEmail = git -C $ClonePath config user.email
if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
    throw "Git needs your commit identity. Run: git config --global user.name `"Your Name`" and git config --global user.email `"your@email.com`", then retry."
}

git -C $ClonePath add -A
if ($LASTEXITCODE -ne 0) { throw "Git could not stage the project files." }
$status = git -C $ClonePath status --porcelain
if ([string]::IsNullOrWhiteSpace(($status -join ""))) {
    Write-Host "The repository already contains these v9.18 files; nothing new to commit."
} else {
    git -C $ClonePath commit -m "Import Arabic Kitten Game v9.18"
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
    git -C $ClonePath push origin $Branch
    if ($LASTEXITCODE -ne 0) { throw "Push failed. Complete GitHub sign-in when prompted, then run this script again." }
}

Write-Host ""
Write-Host "Project files are in: $ClonePath"
Write-Host "GitHub repository: https://github.com/suhaibshd7/toddler_3"
Write-Host "Pages URL: https://suhaibshd7.github.io/toddler_3/"
Write-Host "Pages settings should be: Deploy from a branch / main / (root)."
