export default {
  name: 'English',
  step1: {
    title: 'README',
    leading: 'Please read this carefully before use:',
    term_1: 'May not work for all phones.',
    term_2: 'You may lost your warranty once unlocked.',
    term_3: 'This page was developed <a href="https://github.com/xingrz/frp">in pure HTML5</a>. No backend. No data will be uploaded or saved.',
    term_4: 'This page, brazenly, utilized many cutting-edge HTML5 features. If it doesn\'t work properly, try another browser.',
    term_5: 'Think again carefully before you make this decision. You\'re willing to continue at your own risk.',
    next: 'Okay, continue',
  },
  step2: {
    title: 'Dump',
    instruction_1: 'Dump your FRP partition and save it as frp.bin.',
    instruction_2: 'Ask an experienced user if you don\'t know how to do.',
    previous: 'Previous',
    next: 'Next',
  },
  step3: {
    title: 'Select',
    upload: 'Drop frp.bin here, or <em>click to select</em>',
    previous: 'Previous',
    next: 'Next',
  },
  step4: {
    title: 'Save & Flash',
    success_1: 'File generated.',
    success_2: 'Now, click the following button to download the file,<br>and flash it back to your FRP partition.',
    success_3: 'Again: ask an experienced user if you don\'t know how to do.',
    download: 'Click to download',
    reset: 'Return',
  },
  error: {
    too_small: 'File length less then 1KB, seems not an frp.bin',
    too_large: 'File length larger then 1MB, seems not an frp.bin',
    invalid: 'File not a valid frp.bin',
  },
};
