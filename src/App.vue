<template>
  <el-card id="app" class="box-card">
    <el-steps v-bind:active="step" finish-status="success" align-center class="step" v-show="step != 3">
      <el-step title="用前必读" />
      <el-step title="读取分区" />
      <el-step title="选择文件" />
      <el-step title="下载并刷入" />
    </el-steps>
    <div class="content">
      <section v-show="step == 0">
        <p>请仔细阅读下列文字：</p>
        <ol>
          <li>不是所有手机都适用</li>
          <li>解锁可能会使你丧失保修</li>
          <li>本页面是<a href="https://github.com/xingrz/frp">纯 HTML5 编写</a>，没有后台，不会存储你所上传的数据</li>
          <li>本页面肆无忌惮地使用了很多尖端的 HTML5 技术，如果它不正常，请换一个新的浏览器</li>
          <li>谨慎决定，使用即表明你愿意自行承担风险</li>
        </ol>
        <div class="nav">
          <el-button type="primary" v-on:click="next">明白，下一步</el-button>
        </div>
      </section>
      <section v-show="step == 1">
        <p>读出你的 FRP 分区，存为 frp.bin。</p>
        <p>至于怎么读取，不在本工具的解释范畴内。如果不清楚，建议询问有经验的开发人员。</p>
        <div class="nav">
          <el-button v-on:click="previous">上一步</el-button>
          <el-button type="primary" v-on:click="next">下一步</el-button>
        </div>
      </section>
      <section v-show="step == 2">
        <el-upload
          class="upload-demo"
          style="text-align: center; margin-top: 80px;"
          drag
          action="javascript:"
          v-bind:http-request="upload"
          v-bind:show-file-list="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将 frp.bin 拖到此处，或<em>点击选取</em></div>
        </el-upload>
        <div class="nav">
          <el-button v-on:click="previous">上一步</el-button>
          <el-button type="primary" disabled>下一步</el-button>
        </div>
      </section>
      <section v-show="step == 3">
        <div style="text-align: center; margin-top: 80px; margin-bottom: 40px;">
          <el-progress
            type="circle"
            v-bind:percentage="url ? 100 : 0"
            v-bind:status="url ? 'success' : ''"
          />
        </div>
        <div style="text-align: center;">
          <p>恭喜，文件已生成完毕。</p>
          <p>接下来请点击下面的按钮把文件下载回来，然后刷回 FRP 分区里。</p>
          <p>同样地，怎么刷入，不在本工具的解释范畴内。<br>如果不清楚，建议询问有经验的开发人员。</p>
          <p style="margin-top: 40px;">
            <a download="frp-unlocked.bin" v-bind:href="url">
              <el-button type="primary">点此下载</el-button>
            </a>
          </p>
          <p><el-button type="text" v-on:click="reset">重新开始</el-button></p>
        </div>
      </section>
    </div>
  </el-card>
</template>

<script>
const DIGEST_SIZE_BYTES = 32;

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => resolve(new Uint8Array(evt.target.result));
    reader.onabort = () => resolve(null);
    reader.onerror = (evt) => reject(evt);
    reader.readAsArrayBuffer(file);
  });
}

async function calculateHash(data) {
  data.fill(0x00, 0, DIGEST_SIZE_BYTES);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(digest);
}

function toHex(data) {
  return data.map(b => b.toString(16).padStart(2, '0')).join('');
}

function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      step: 0,
      url: null,
    };
  },
  methods: {
    previous() {
      this.step--;
    },
    next() {
      this.step++;
    },
    reset() {
      this.url = null;
      this.step = 0;
    },
    async upload({ file }) {
      if (file.size < 1 * 1024) {
        this.$message.error('文件大小不足 1KB，看起来不像是个 frp.bin');
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        this.$message.error('文件大小超过 1MB，看起来不像是个 frp.bin');
        return;
      }

      const data = await readFile(file);
      console.log(`read data, length: ${data.length / 1024}KB`);

      const originalHash = data.slice(0, DIGEST_SIZE_BYTES);
      console.log(`original hash: ${toHex(originalHash)}`);

      const computedHash = await calculateHash(data);
      console.log(`computed hash: ${toHex(computedHash)}`);

      if (originalHash.toString() != computedHash.toString()) {
        this.$message.error('这看起来不是一个正常的 frp.bin');
        return;
      }

      data[data.length - 1] = 0x01;

      const finalHash = await calculateHash(data);
      console.log(`final hash: ${toHex(finalHash)}`);

      data.set(finalHash, 0);

      const blob = new Blob([ data.buffer ]);
      const url = window.URL.createObjectURL(blob);

      this.step++;

      await sleep(100);
      this.url = url;

      // const link = $('url');
      // link.download = 'frp-unlocked.bin';
      // link.href = url;

      // $('download').style.display = 'block';
    },
  },
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  background: #999;
}

a, a:visited {
  color: #39f;
}

#app {
  max-width: 800px;
  margin: 40px auto;
}

.step {
  margin-top: 40px;
  margin-bottom: 50px;
}

.content {
  margin: 0 50px 20px;
}

.nav {
  margin-top: 80px;
  text-align: right;
}
</style>
