<template>
    <div class="management">
        <m-head></m-head>
        <div class="body-wrap">
            <ul class="side-nav" ref="sideNav">
                <li>商品管理</li>
                <li>
                    <router-link :to="{name:'productList'}">商品列表</router-link>
                </li>
                <li>
                    <router-link :to="{name:'edit'}">增加商品</router-link>
                </li>
                <li>
                    <router-link :to="{name:'productList'}">分类管理</router-link>
                </li>
                <li>
                    <router-link :to="{name:'productList'}">商品分类列表</router-link>
                </li>
                <li>
                    <router-link :to="{name:'productList'}">增加商品分类</router-link>
                </li>
            </ul>
            <div class="content">
                <h3>商品管理 / {{moduleName}}</h3>
                <router-view></router-view>
            </div>
        </div>

    </div>
</template>

<script>
    import mHead from './Head/mHead'

    export default {
        name: "management",
        data(){
            return {
                moduleName: '',
            }
        },
        components: {
            mHead,
        },
        mounted() {
            this.$refs.sideNav.onclick = function (e) {
                this.moduleName = e.target.innerHTML;
                [...this.$refs.sideNav.children].forEach((child)=>{
                    child.classList.remove('choose');
                });
                e.target.parentNode.classList.add('choose');
            }.bind(this);
        },
        methods: {

        }
    }
</script>

<style scoped>
    .body-wrap {
        display: flex;
        padding: 20px 15px;
    }
    .side-nav{
        height: fit-content;
    }
    .side-nav li {
        width: 196px;
        height: 40px;
        border: 1px solid #ddd;
        border-top: none;
        line-height: 40px;
        text-indent: 15px;
    }

    .side-nav li:first-child {
        border: 1px solid #428BCA;
        border-radius: 5px 5px 0 0;
        background-color: #428BCA;
        color: #fff;
    }

    .side-nav li:last-child {
        border-radius: 0 0 5px 5px;
    }

    .side-nav li + li:hover {
        background-color: #f5f5f5;
        cursor: pointer;
    }

    .side-nav li > a {
        display: block;
        width: 100%;
        height: 100%;
    }

    .content {
        width: 100%;
        padding-left: 30px;
        max-width: 1070px;
    }

    .content h3 {
        width: 100%;
        height: 36px;
        margin-bottom: 20px;
        border-radius: 5px;
        background-color: #f5f5f5;
        color: #777;
        line-height: 36px;
        font-size: 14px;
        text-indent: 15px;
        font-weight: normal;
    }
    li.choose{
        background-color: #f5f5f5;
    }
</style>
