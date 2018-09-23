import Vue from 'vue'
import Router from 'vue-router'
import logIn from '../components/logIn'
import Management from '../components/Management/Management'
import err404 from '../components/err404'
import productList from '../components/Management/Body/productList'
import edit from '../components/Management/Body/edit'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'logIn',
            component: logIn
        }, {
            path: '/management',
            name: 'management',
            component: Management,
            children: [{
                path: 'productList',
                name: 'productList',
                component: productList
            },{
                path: 'edit',
                name: 'edit',
                component: edit
            }]
        }, {
            path: '*',
            name: 'err404',
            component: err404
        }
    ]
})
