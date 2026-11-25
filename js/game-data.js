/* Arabic Learning Game — activity content and local audio paths. No external dependencies. */
(function () {
  'use strict';

  window.LEARNING_GAME = {
    activities: {
      animals: {
        id: 'animals',
        title: 'الحيوانات',
        icon: '🐾',
        choiceInstruction: 'اختر الحيوان المناسب',
        items: [
          { id: 'cat', word: 'قطة', emoji: '🐱', image: 'assets/animals/cat.webp', audioId: 'animal.cat' },
          { id: 'dog', word: 'كلب', emoji: '🐶', image: 'assets/animals/dog.webp', audioId: 'animal.dog' },
          { id: 'rabbit', word: 'أرنب', emoji: '🐰', image: 'assets/animals/rabbit.webp', audioId: 'animal.rabbit' },
          { id: 'bear', word: 'دب', emoji: '🐻', image: 'assets/animals/bear.webp', audioId: 'animal.bear' },
          { id: 'duck', word: 'بطة', emoji: '🦆', image: 'assets/animals/duck.webp', audioId: 'animal.duck' }
        ]
      },
      colors: {
        id: 'colors',
        title: 'الألوان',
        icon: '🎨',
        choiceInstruction: 'اختر اللون المناسب',
        items: [
          { id: 'red', word: 'أحمر', color: '#ef5350', audioId: 'color.red' },
          { id: 'blue', word: 'أزرق', color: '#4388e8', audioId: 'color.blue' },
          { id: 'yellow', word: 'أصفر', color: '#ffd43b', audioId: 'color.yellow' },
          { id: 'green', word: 'أخضر', color: '#39b96b', audioId: 'color.green' },
          { id: 'orange', word: 'برتقالي', color: '#ff922b', audioId: 'color.orange' },
          { id: 'purple', word: 'بنفسجي', color: '#9b70dc', audioId: 'color.purple' }
        ]
      },
      numbers: {
        id: 'numbers',
        title: 'الأرقام',
        icon: '🔢',
        choiceInstruction: 'اختر الرقم المناسب',
        items: [
          { id: 'one', word: 'واحد', numeral: '١', count: 1, audioId: 'number.one' },
          { id: 'two', word: 'اثنان', numeral: '٢', count: 2, audioId: 'number.two' },
          { id: 'three', word: 'ثلاثة', numeral: '٣', count: 3, audioId: 'number.three' },
          { id: 'four', word: 'أربعة', numeral: '٤', count: 4, audioId: 'number.four' },
          { id: 'five', word: 'خمسة', numeral: '٥', count: 5, audioId: 'number.five' }
        ]
      },
      letters: {
        id: 'letters',
        title: 'الحروف',
        icon: '🔤',
        choiceInstruction: 'اختر الحرف المناسب',
        items: [
          { id: 'alif', word: 'ألف', letter: 'ا', audioId: 'letter.alif' },
          { id: 'baa', word: 'باء', letter: 'ب', audioId: 'letter.baa' },
          { id: 'jeem', word: 'جيم', letter: 'ج', audioId: 'letter.jeem' }
        ]
      },
      shapes: {
        id: 'shapes',
        title: 'الأشكال',
        icon: '🔺',
        choiceInstruction: 'اختر الشكل المناسب',
        items: [
          { id: 'circle', word: 'دائرة', shape: 'circle', color: '#ff8b67', audioId: 'shape.circle' },
          { id: 'square', word: 'مربع', shape: 'square', color: '#628fe8', audioId: 'shape.square' },
          { id: 'triangle', word: 'مثلث', shape: 'triangle', color: '#55b98b', audioId: 'shape.triangle' },
          { id: 'star', word: 'نجمة', shape: 'star', color: '#f2bd45', audioId: 'shape.star' }
        ]
      }
    },
    /* Keep spoken feedback to short standalone words, as requested. */
    praise: [
      { id: 'wellDone', word: 'أحسنت', audioId: 'praise.well_done' },
      { id: 'great', word: 'رائع', audioId: 'praise.great' },
      { id: 'excellent', word: 'ممتاز', audioId: 'praise.excellent' },
      { id: 'bravo', word: 'برافو', audioId: 'praise.bravo' },
      { id: 'greatJob', word: 'عظيم', audioId: 'praise.great_job' }
    ],
    optionalAudio: {
      // Add this file when ready: a short human-recorded clip saying "انتهت اللعبة".
      'instruction.game_ended': 'assets/audio/instructions/game-ended.mp3'
    },
    audio: {
      'animal.cat': 'assets/audio/animals/cat.mp3',
      'animal.dog': 'assets/audio/animals/dog.mp3',
      'animal.rabbit': 'assets/audio/animals/rabbit.mp3',
      'animal.bear': 'assets/audio/animals/bear.mp3',
      'animal.duck': 'assets/audio/animals/duck.mp3',
      'color.red': 'assets/audio/colors/red.mp3',
      'color.blue': 'assets/audio/colors/blue.mp3',
      'color.yellow': 'assets/audio/colors/yellow.mp3',
      'color.green': 'assets/audio/colors/green.mp3',
      'color.orange': 'assets/audio/colors/orange.mp3',
      'color.purple': 'assets/audio/colors/purple.mp3',
      'praise.well_done': 'assets/audio/praise/well-done.mp3',
      'praise.great': 'assets/audio/praise/great.mp3',
      'praise.excellent': 'assets/audio/praise/excellent.mp3',
      'praise.bravo': 'assets/audio/praise/bravo.mp3',
      'praise.great_job': 'assets/audio/praise/great-job.mp3',
      'praise.correct_answer': 'assets/audio/praise/correct-answer.mp3',
      'praise.wow': 'assets/audio/praise/wow.mp3',
      'praise.try_again': 'assets/audio/praise/try-again.mp3',
      'instruction.hello': 'assets/audio/instructions/hello.mp3',
      'instruction.lets_play': 'assets/audio/instructions/lets-play.mp3',
      'instruction.listen_to_word': 'assets/audio/instructions/listen-to-word.mp3',
      'instruction.find_correct_picture': 'assets/audio/instructions/find-correct-picture.mp3',
      'instruction.good_very_good': 'assets/audio/instructions/very-good.mp3',
      'instruction.you_did_well': 'assets/audio/instructions/you-did-well.mp3',
      'shape.circle': 'assets/audio/shapes/circle.mp3',
      'shape.square': 'assets/audio/shapes/square.mp3',
      'shape.triangle': 'assets/audio/shapes/triangle.mp3',
      'shape.star': 'assets/audio/shapes/star.mp3',
      'number.one': 'assets/audio/numbers/one.mp3',
      'number.two': 'assets/audio/numbers/two.mp3',
      'number.three': 'assets/audio/numbers/three.mp3',
      'number.four': 'assets/audio/numbers/four.mp3',
      'number.five': 'assets/audio/numbers/five.mp3',
      'letter.alif': 'assets/audio/letters/alif.mp3',
      'letter.baa': 'assets/audio/letters/baa.mp3',
      'letter.jeem': 'assets/audio/letters/jeem.mp3'
    }
  };
})();
