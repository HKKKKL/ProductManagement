import Vuex from "vuex";
import Vue from "vue";
import logIn from './modules/logIn'
import productList from './modules/productList'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        logIn,
        productList,
    },
    state: {
        __url: '',
        __correctLogIn: false,
    },
    mutations: {
        urlTrue(state, resData){
            state.__url = state.__url || resData;
            state.__correctLogIn = true;
        },
        urlFalse(state){
            state.__url = '';
            state.__correctLogIn = false;
        }

    },


});

export default store;
