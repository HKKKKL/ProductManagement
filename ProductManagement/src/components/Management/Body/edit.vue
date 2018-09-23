<template>
    <div class="addProduct">
        <h3>增加商品</h3>
        <form>
            <p><span>商品名称：</span><input type="text" v-model="newProduct.name"></p>
            <p>
                <span>商品图片：</span>
                <input type="file" value="选择文件" ref="chooseImg" @change="showImg($event)">
                <img :src=newImgSrc width="80px">
            </p>
            <p><span>商品价格：</span><input type="text" v-model="newProduct.price"></p>
            <p><span>商品邮费：</span><input type="text" v-model="newProduct.postage"></p>
            <p><span>商品描述：</span><textarea v-model="newProduct.discription"></textarea></p>
            <el-button type="primary" size="small" @click="uploadData">提交</el-button>
        </form>
    </div>
</template>

<script>
    export default {
        name: "edit",
        data() {
            return {
                newProduct: {
                    name: '',
                    icon: '',
                    price: '',
                    postage: '',
                    discription: ''
                },
                newImgSrc: ''
            }
        },
        methods: {
            showImg(e) {
                if (e.target.files[0]) this.newImgSrc = window.URL.createObjectURL(e.target.files[0]);
            },
            uploadData() {
                let oFormData = new FormData();
                let file = this.$refs.chooseImg.files[0];
                oFormData.append('avatar', file);
                oFormData.append('newProductData', JSON.stringify(this.newProduct));
                this.$axios({
                    method: 'post',
                    url: '/addProduct',
                    data: oFormData
                }).then(response => {
                    if (response.data) {
                        this.$store.dispatch('getProductData');
                        for (let key in this.newProduct) {
                            this.newProduct[key] = '';
                        }
                        this.$refs.chooseImg.outerHTML = this.$refs.chooseImg.outerHTML;
                        this.newImgSrc = '';
                        this.successNote();
                    }

                }).catch(err => {
                    console.log(err);
                    this.failNote();
                })
            },
            successNote() {
                this.$notify({
                    title: '成功！',
                    message: '商品插入成功',
                    type: 'success'
                });
            },
            failNote(){
                this.$notify.error({
                    title: '失败！',
                    message: '商品插入失败',
                });
            }
        }
    }
</script>

<style scoped>
    .addProduct {
        width: 100%;
        border: 1px solid #ddd;
        overflow: hidden;
    }

    h3 {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #ddd;
        background-color: #f5f5f5;
        line-height: 40px;
        font-weight: normal;
        font-size: 14px;
        text-indent: 15px;
    }

    form {
        padding: 20px 55px 25px;
    }

    form textarea {
        width: 375px;
        height: 160px;
        resize: none;
    }

    form input {
        margin-bottom: 5px;
    }

    form input[type=text] {
        width: 170px;
        height: 20px;
    }

    form p:last-of-type {
        margin-bottom: 20px;
    }
</style>
