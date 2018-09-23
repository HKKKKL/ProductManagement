import axios from 'axios'

const store = {
    state: {
        accountName: '',
        password: ''
    },
    mutations: {
        updateAccount(state,newValue){
            state.accountName = newValue.accountName;
            state.password = newValue.password;
        }
    },
    actions: {
        async logInManagement(context) {
            await new Promise((res, rej) => {
                axios({
                    method: 'post',
                    url: '/logIn',
                    withCredentials: true,
                    data: {
                        accountName: context.state.accountName,
                        password: context.state.password
                    }
                }).then(response => {
                    if(response.data){
                        context.commit('urlTrue', response.data);
                    }else{
                        context.commit('urlFalse');
                    }
                    res();
                }).catch(err => {
                    console.log(err);
                    rej();
                })
            });
        }

    }

};

export default store;
