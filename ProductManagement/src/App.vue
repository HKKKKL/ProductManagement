<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'App',
        data() {
            return {}
        },
        mounted() {
            window.onhashchange = function (e) {
                if (window.location.hash === '#/') {
                    this.$store.commit('urlFalse');
                }
                if (window.location.hash !== '#/') {
                    if (!this.$store.state.__correctLogIn) {//不在登录情况下拒绝页面跳转
                        this.$router.push({name: 'logIn'})
                    }
                }
            }.bind(this);
        }
    }
</script>

<style>
    html, body, #app {
        height: 100%;
        overflow: hidden;
    }
</style>
