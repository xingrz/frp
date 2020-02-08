import Vue from 'vue';
import VueI18n from 'vue-i18n';
import App from './App.vue';
import './plugins/element.js';
import messages from './i18n';

Vue.config.productionTip = false;

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages,
});

new Vue({
  i18n,
  render: h => h(App),
}).$mount('#app');
