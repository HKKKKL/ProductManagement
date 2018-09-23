import axios from 'axios'

const store = {
    state: {
        __productData: {}
    },
    actions: {
        async getProductData(context) {
            await new Promise((res, rej) => {
                axios({
                    method: 'post',
                    url: '/productList',
                }).then(response=>{
                    context.commit('getProductData',response.data);
                    res();
                }).catch(err=>{
                    console.log('请求错误：'+err);
                    rej();
                })
            })
        }
    },
    mutations:{
        getProductData(state,data){
            state.__productData = {};
            for(let key in data){
                state.__productData[key] = data[key];
            }
        }
    }
};


export default store;
