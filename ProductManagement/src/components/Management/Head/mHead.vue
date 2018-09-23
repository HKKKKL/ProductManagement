<template>
    <div class="head-wrap">
        <div class="h-left">
            <img src="@/imgs/node.jpg" alt="本站为Node后台" height="44">
            <span>商品管理</span>
            <span>系统设置</span>
        </div>
        <div class="h-right">
            <span>欢迎您，{{currentUser}}</span>
            <span @click="logOut">安全退出</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "mHead",
        data() {
            return {
                currentUser: '',
            }
        },
        mounted() {
            this.$axios({
                method: 'post',
                url: '/reload',
                withCredentials: true,
            }).then(response => {
                this.currentUser = response.data;
                this.$store.commit('urlTrue');
            }).catch(() => {
            });
        },
        methods: {
            logOut() {
                this.$router.push({name: 'logIn'});
                this.$store.commit('urlFalse');
            }
        }
    }
</script>

<style scoped>
    .head-wrap {
        width: 100%;
        height: 50px;
        border: 1px solid #080808;
        border-radius: 5px;
        background-color: #46473f;
        color: #fff;
    }

    .head-wrap .h-left {
        float: left;
    }

    .head-wrap .h-right {
        float: right;
    }

    .head-wrap > div > span {
        display: inline-block;
        height: 50px;
        padding: 0 20px;
        line-height: 50px;
    }

    .head-wrap .h-left img {
        margin-left: 20px;
    }

    .head-wrap .h-left span:hover {
        background-color: #080808;
        cursor: pointer;
    }

    .h-right span:last-of-type:hover {
        background-color: #0d0e0a;
        cursor: pointer;
    }

</style>
