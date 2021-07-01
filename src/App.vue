<template>
  <div id="app">
    <el-card class="box-card">
      <el-steps v-bind:active="step" finish-status="success" align-center class="step" v-show="step != 3">
        <el-step v-bind:title="$t('step1.title')" />
        <el-step v-bind:title="$t('step2.title')" />
        <el-step v-bind:title="$t('step3.title')" />
        <el-step v-bind:title="$t('step4.title')" />
      </el-steps>
      <div class="content">
        <section v-show="step == 0">
          <p>{{ $t('step1.leading') }}</p>
          <ol>
            <li v-html="$t('step1.term_1')" />
            <li v-html="$t('step1.term_2')" />
            <li v-html="$t('step1.term_3')" />
            <li v-html="$t('step1.term_4')" />
            <li v-html="$t('step1.term_5')" />
          </ol>
          <div class="nav">
            <el-select v-model="$root.$i18n.locale" style="margin-right: 1em;">
              <el-option
                v-for="lang of Object.keys(langs)"
                v-bind:key="lang"
                v-bind:label="langs[lang].name"
                v-bind:value="lang" />
            </el-select>
            <el-button type="primary" v-on:click="next">{{ $t('step1.next') }}</el-button>
          </div>
        </section>
        <section v-show="step == 1">
          <p v-html="$t('step2.instruction_1')" />
          <p v-html="$t('step2.instruction_2')" />
          <div class="nav">
            <el-button type="text" v-on:click="previous" style="margin-right: 1em;">{{ $t('step2.previous') }}</el-button>
            <el-button type="primary" v-on:click="next">{{ $t('step2.next') }}</el-button>
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
            <div class="el-upload__text" v-html="$t('step3.upload')" />
          </el-upload>
          <div class="nav">
            <el-button type="text" v-on:click="previous" style="margin-right: 1em;">{{ $t('step3.previous') }}</el-button>
            <el-button type="primary" disabled>{{ $t('step3.next') }}</el-button>
          </div>
        </section>
        <section v-show="step == 3">
          <div style="text-align: center; margin-top: 80px; margin-bottom: 40px;">
            <el-progress
              type="circle"
              v-bind:percentage="url ? 100 : 0"
              v-bind:status="url ? 'success' : null"
            />
          </div>
          <div style="text-align: center;">
            <p v-html="$t('step4.success_1')" />
            <p v-html="$t('step4.success_2')" />
            <p v-html="$t('step4.success_3')" />
            <p style="margin-top: 40px;">
              <a download="frp-unlocked.bin" v-bind:href="url">
                <el-button type="primary">{{ $t('step4.download') }}</el-button>
              </a>
            </p>
            <p><el-button type="text" v-on:click="reset">{{ $t('step4.reset') }}</el-button></p>
          </div>
        </section>
      </div>
    </el-card>
    <footer>
      Copyright (C) 2019-2021 XiNGRZ
    </footer>
  </div>
</template>

<script>
import langs from './i18n';
console.log(langs);

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
      langs,
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
        this.$message.error(this.$t('error.too_small'));
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        this.$message.error(this.$t('error.too_large'));
        return;
      }

      const data = await readFile(file);
      console.log(`read data, length: ${data.length / 1024}KB`);

      const originalHash = data.slice(0, DIGEST_SIZE_BYTES);
      console.log(`original hash: ${toHex(originalHash)}`);

      const computedHash = await calculateHash(data);
      console.log(`computed hash: ${toHex(computedHash)}`);

      if (originalHash.toString() != computedHash.toString()) {
        this.$message.error(this.$t('error.invalid'));
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

footer {
  text-align: center;
  margin-top: 20px;
  color: #555;
  font-size: 12px;
}
</style>
