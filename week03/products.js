
//Vue 起手式
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


createApp({
    //處理資料
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'aweishi',
            products: [],
            //判斷商品資訊是否為新的，以判斷狀態為新增或編輯
            isNew: false,
            tempProduct: {
                //新增商品圖片
                imagesUrl: [],
            },
            modalProduct: null,// productModal使用
            modalDel: null, // delProductModal使用
        }
    },
    methods: {
        //方法集

        //確認登入狀態
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                //若確認是登入狀態，就讀取商品資料
                .then(() => {
                    this.getData();
                })
                .catch((err) => {
                    // 若非登入狀態，跳alert訊息
                    alert(err.data.message);
                    // 若非登入狀態，將當前url轉向login.html
                    windows.location = 'login.html'

                })
        },


        //取得商品資料
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url)
                .then((res) => {

                    //解構商品資訊並寫入products物件
                    this.products = res.data.products;
                    // console.log(this.products);
                })
                //若失敗跳出alert
                .catch((err) => {
                    alert(err.data.message);
                })
        },

       
        //編輯與新增共用同個Modal，更新時候，依據新增與編輯的不同，決定呼叫的API
        openModal(status, item) {
            if(status === 'new'){
                this.tempProduct ={
                    imagesUrl: [],
                };
                this.isNew = true;
                this.modalProduct.show();
            }else if(status === 'edit'){
                //若編輯時，淺拷貝product賦予至tempProduct上
                this.isNew = false;
                this.tempProduct = { ...item };
                this.modalProduct.show();
            }else if(status === 'delete'){
                this.tempProduct = { ...item };
                this.modalDel.show();
            };
            
        },

        //新增產品
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';


            //編輯
            if(!this.isNew){
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }

            axios[method](url, { data: this.tempProduct })
                .then((res) => {
                    console.log(res);
                    //跳出新增成功alert
                    alert(res.data.message);
                    //按下確認後要重新撈取商品資料
                    this.getData();
                    //按下確認後要關閉Modal
                    this.modalProduct.hide();
                    //新增後清除輸入匡
                    this.tempProduct ={};

                })
                // 若失敗跳出alert
                .catch((err) => {
                    alert(err.data.message);
                })

        },

 


        //刪除資料
        deleteProduct() {
            //利用id反找索引值
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
            axios.delete(url)
                .then((res) => {
                    alert(res.data.message);
                    
                    this.getData();
                    this.modalDel.hide();
                }).catch((err) => {
                    alert(err.data.message);
                })

        },

        //新增商品
        addProduct() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },



    },
    //生命週期，mounted是網頁初始化後執行
    mounted() {



        //取出Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        console.log(token);
        //認證紀錄token
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin();


        console.log(this.$refs);
        //與Modal綁定
        // new...=> 建立實體賦予到modalProduct
        // ref統一要加上s
        this.modalProduct = new bootstrap.Modal(this.$refs.productModal);
        //show為實體方法
        this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
        
    }
}).mount('#app');

