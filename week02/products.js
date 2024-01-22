
//Vue 起手式
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    //處理資料
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'aweishi',
            products: [],
            tempProducts: {},
        }
    },
    methods: {
        
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                //若確認是登入狀態，就讀取商品資料
                .then(() => {
                    this.getData();
                })
                .catch((err)=>{
                    // 若非登入狀態，跳alert訊息
                    alert(err.response.data.message);
                    // 若非登入狀態，將當前url轉向login.html
                    windows.location='login.html'

                })
        },
        //取得商品資料
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url)
                .then((res) => {
                    //解構商品資訊並寫入products物件
                    this.products = res.data.products;
                    console.log(this.products);
                })
                //若失敗跳出alert
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        openProduct(item) {
            this.tempProducts = item;
        }

    },

    mounted() {
        //取出Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        //認證紀錄token
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin()
    }
}).mount('#app');

