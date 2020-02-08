export default {
  name: '中文',
  step1: {
    title: '用前必读',
    leading: '请仔细阅读下列文字：',
    term_1: '不是所有手机都适用',
    term_2: '解锁可能会使你丧失保修',
    term_3: '本页面是<a href="https://github.com/xingrz/frp">纯 HTML5 编写</a>，没有后台，不会存储你所上传的数据',
    term_4: '本页面肆无忌惮地使用了很多尖端的 HTML5 技术，如果它不正常，请换一个新的浏览器',
    term_5: '谨慎决定，使用即表明你愿意自行承担风险',
    next: '明白，下一步',
  },
  step2: {
    title: '读取分区',
    instruction_1: '读出你的 FRP 分区，存为 frp.bin。',
    instruction_2: '至于怎么读取，不在本工具的解释范畴内。如果不清楚，建议询问有经验的用户。',
    previous: '上一步',
    next: '下一步',
  },
  step3: {
    title: '选择文件',
    upload: '将 frp.bin 拖到此处，或<em>点击选取</em>',
    previous: '上一步',
    next: '下一步',
  },
  step4: {
    title: '下载并刷入',
    success_1: '恭喜，文件已生成完毕。',
    success_2: '接下来请点击下面的按钮把文件下载回来，然后刷回 FRP 分区里。',
    success_3: '同样地，怎么刷入，不在本工具的解释范畴内。<br>如果不清楚，建议询问有经验的开发人员。',
    download: '点此下载',
    reset: '重新开始',
  },
  error: {
    too_small: '文件大小不足 1KB，看起来不像是个 frp.bin',
    too_large: '文件大小超过 1MB，看起来不像是个 frp.bin',
    invalid: '这看起来不是一个正常的 frp.bin',
  },
};
