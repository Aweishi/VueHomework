
//Vue 起手式
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    //處理資料
    data() {
        return {
              //定義user，取得username和password
            user: {
                username: '',
                password: '',
            },
        }
    },
    methods: {
        login() {
          const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
          axios.post(api, this.user).then((response) => {
            // 解構token和expired
            console.log(this.user);
            const { token, expired } = response.data;
            // 寫入 cookie token
            // expires 設置有效時間
            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
            //將當前瀏覽器的 URL 改變為相對於當前位置的 'products.html'
            window.location = 'products.html';
          }).catch((err) => {
            alert(err.response.data.message);
          });
        },
      },
}).mount('#app');

