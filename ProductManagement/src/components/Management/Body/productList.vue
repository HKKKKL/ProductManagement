<template>
    <div class="s-wrap">
        <div class="search">
            <header>搜索 / {{searchInfo}}</header>
            <div class="s-content">
                <span>名称</span>
                <input type="text"
                       placeholder="请输入名称"
                       @input="getSearchData"
                       @blur="searchVisible=false"
                       @focus="searchVisible=true"
                       v-model="searchMsg">
                <input type="button" value="开始搜索" @click="beginSearch">
                <ul class="search-option" v-if="searchVisible">
                    <li v-for="(item,index) in searchData"
                        @mousedown="searchMsg=searchData[index]">
                        {{item}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="s-table" v-loading="productDataLoading">
            <el-table :data="productData" stripe style="width: 100%" height="300">
                <el-table-column prop="number" label="编号" width="120" align="center"></el-table-column>
                <el-table-column label="图标" width="120" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon" alt="" width="20px">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="350"></el-table-column>
                <el-table-column prop="price" label="价格" width="120" align="center"></el-table-column>
                <el-table-column prop="postage" label="邮费" width="120" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" type="text" size="small">修改</el-button>
                        <el-button type="text" size="small"
                                   @click.native.prevent="deleteRow(scope.$index, productData)">移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <transition name="el-fade-in-linear">
            <div class="update-box"
                 v-if="updateVisible"
                 v-loading='updateWrapLoading'>
                <form>
                    <h3>修改商品信息</h3>
                    <label for="name">名称:</label>
                    <el-input id="name" type="text" v-model="updateProductData.name"></el-input>
                    <br/>
                    <label>图标:</label><img :src="updateProductData.icon" alt="" width="20px">
                    <div class="wrap-el-upload">
                        <el-upload
                            action=""
                            :auto-upload=false
                            :on-change="getFile"
                            :limit=1
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                    <!--<img :src="updateProductData.icon" alt="">-->
                    <!--<br/>-->
                    <label for="price">价格:</label>
                    <el-input id="price" type="text" v-model="updateProductData.price"></el-input>
                    <br/>
                    <label for="postage">邮费:</label>
                    <el-input id="postage" type="text" v-model="updateProductData.postage"></el-input>
                    <br/>
                    <div class="wrap-button">
                        <el-button type="primary" plain @click="goUpdate">提交</el-button>
                        <el-button plain @click="cancelUpdate">取消</el-button>
                    </div>

                </form>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapMutations, mapActions, mapState} from 'vuex'

    export default {
        name: "product-list",
        data() {
            return {
                searchInfo: '',
                searchMsg: '',
                searchData: [],
                searchVisible: false,
                searchOptions: '',
                productData: null,
                origProductData: [],
                srchProductData: [],
                productDataLoading: false,
                updateVisible: false,
                updateWrapLoading: false,
                updateProductData: {
                    originName: '',
                    name: '',
                    icon: '',
                    price: '',
                    postage: ''
                },
                imgFile: null,
                dialogImageUrl: '',
                dialogVisible: false
                /**
                 icon: '',
                 name: '',
                 price: '',
                 postage: ''
                 **/
            }
        },
        mounted() {
            this.initData();
        },
        computed: {
            ...mapState({
                __productData: function () {
                    return this.$store.state.productList.__productData;
                }
            })
        },
        methods: {
            initData() {
                this.origProductData = [];
                this.productData = null;
                this.productDataLoading = true;
                this.$store.dispatch('getProductData')
                    .then(() => {
                        for (let key in this.__productData) {
                            this.origProductData.push(this.__productData[key]);
                        }
                        this.origProductData.sort(function (a, b) {
                            return parseInt(a.price) - parseInt(b.price);
                        })
                    })
                    .then(() => {
                        this.productData = this.origProductData;
                        this.setNumber(this.productData);
                        this.productDataLoading = false;
                        this.getDataSuccessNote();
                    })
                    .catch(err => {
                        console.log(err);
                        this.getDataFailNote();
                    });
            },
            handleEdit(row) {
                for (let key in this.updateProductData) {
                    this.updateProductData[key] = row[key];
                    this.updateProductData.originName = row.name;
                }
                this.updateVisible = true;
            },
            getFile(file) {
                this.imgFile = file.raw;
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            goUpdate() {
                let postData = new FormData();
                if (this.imgFile) postData.append('updateImg', this.imgFile);
                postData.append('updateData', JSON.stringify(this.updateProductData));
                this.updateWrapLoading = true;
                this.$axios({
                    method: 'post',
                    url: '/update',
                    data: postData,
                })
                    .then(response => {
                        if (response.data) {
                            this.updateWrapLoading = false;
                            this.updateVisible = false;
                            this.updateSuccessNote();
                        } else {
                            this.updateFailNote();
                        }
                        this.initData();
                    })
                    .catch(err => {
                        this.updateWrapLoading = false;
                        this.updateVisible = false;
                        this.$notify.error({
                            title: err,
                        });
                    })
            },
            cancelUpdate() {
                for (let key in this.updateProductData) {
                    this.updateProductData[key] = ''
                }
                this.updateVisible = false;
            },
            deleteRow(index, rows) {
                this.$axios({
                    method: 'post',
                    url: 'delProduct',
                    data: {name: rows[index].name}
                })
                    .then(() => {
                        rows.splice(index, 1);
                        this.setNumber(rows);
                        this.deleteSuccessNote();
                    })
                    .catch(err => {
                        console.log(err);
                        this.deleteFailNote();
                    })
            },
            beginSearch() {
                this.srchProductData = [];
                new Promise((res, rej) => {
                    let flag = false;
                    this.origProductData.forEach(data => {
                        if (data.name.indexOf(this.searchMsg) !== -1) {
                            this.srchProductData.push(data);
                            this.productData = this.srchProductData;
                            this.setNumber(this.productData);
                            flag = true;
                        }
                    });
                    flag ? res() : rej()
                }).then(() => {
                    this.searchInfo = this.searchMsg;
                    this.searchMsg = '';
                }).catch(() => {
                    this.productData = this.origProductData;
                    alert('没有查到相应商品!');

                })
            },
            setNumber(productData) {
                let i = 1;
                productData.forEach(item => {
                    item.number = i;
                    i++;
                })
            },
            getSearchData() {
                this.searchVisible = this.searchMsg ? 1 : 0;

                this.searchData = [];
                if (this.searchMsg) {
                    this.origProductData.forEach((data, index) => {
                        if (data.name.indexOf(this.searchMsg) !== -1) {
                            if (!this.searchData.includes(data.name)) this.searchData.push(data.name);
                        }
                    })
                }
            },

            getDataSuccessNote() {
                this.$notify({
                    title: '获取商品数据成功！',
                    type: 'success'
                });
            },
            getDataFailNote() {
                this.$notify.error({
                    title: '商品数据获取失败！',
                });
            },
            deleteSuccessNote() {
                this.$notify({
                    title: '删除成功！',
                    type: 'success'
                });
            },
            deleteFailNote() {
                this.$notify.error({
                    title: '删除失败！',
                });
            },
            updateSuccessNote() {
                this.$notify({
                    title: '数据更新成功！',
                    type: 'success'
                });
            },
            updateFailNote() {
                this.$notify.error({
                    title: '更新失败！',
                });
            },
        },
    }
</script>

<style scoped>
    .s-wrap {
        width: 100%;
    }

    .search {
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 1px 2px #ddddd8;
    }

    .search header {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #ddd;
        background-color: #f5f5f5;
        line-height: 40px;
        text-indent: 15px;
    }

    .s-content {
        position: relative;
        display: flex;
        height: 64px;
        align-items: center;
    }

    .s-content span {
        font-weight: bold;
        text-indent: 15px;
    }

    .s-content input[type=text] {
        width: 170px;
        height: 20px;
        margin: 0 5px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .s-content input[type=button] {
        width: 80px;
        height: 34px;
        border: 1px solid #ccc;
        border-radius: 3px;
        background-color: #fff;
        cursor: pointer;
    }

    .s-content input[type=button]:hover {
        background-color: #e6e6e6;
    }

    .s-table {
        width: 100%;
        margin-top: 20px;
    }

    .update-box {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, .2);
    }

    .update-box {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .update-box form {
        height: fit-content;
        padding: 30px;
        border-radius: 10px;
        background-color: #fff;
    }

    .update-box form h3 {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #bfbfbf;
    }

    .update-box form label {
        margin-right: 10px;
    }

    .update-box form .el-input {
        width: 370px;
        margin: 10px 0;
    }

    .wrap-el-upload {
        padding-left: 46px;
    }

    .wrap-button {
        display: flex;
        margin-top: 5px;
        justify-content: center;
    }

    .search-option {
        position: absolute;
        top: 49px;
        left: 47px;
        border: 1px solid #cccccc;
        border-radius: 5px;
        background-color: #fff;
        overflow: hidden;
        z-index: 1000;
    }

    .search-option li {
        width: 195px;
        height: 30px;
        line-height: 30px;
        text-indent: 15px;
        cursor: pointer;
    }

    .search-option li + li {
        border-top: 1px solid #cccccc;
    }

    .search-option li:hover {
        background-color: #cccccc;
    }
</style>
