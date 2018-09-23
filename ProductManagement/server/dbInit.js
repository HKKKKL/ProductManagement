const mongoose = require('mongoose');
const userModel = require('./Model/userModel');
const productModel = require('./Model/productModel');

mongoose.connect('mongodb://127.0.0.1:27017/' + 'productManagement', {useNewUrlParser: true});
let db = mongoose.connection;
let productName = [
    '华为Mate9',
    '华为P20',
    '华为nova2',
    'SONY笔记本电脑',
    '立顿红茶',
    '雷蛇键盘',
    'vivo NEX',
    'MacBookAir',
    'oppo FindX',
    'oppo R17',
    '公牛插座',
    '中秋月饼多口味400g'];
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    new Promise((res, rej) => {
        let userTable = new userModel({
            id: 10000,
            accountName: 'hukailin',
            password: '123456789'
        });
        userTable.save((err, table) => {
            if (err) {
                console.error('数据已存在');
            } else {
                console.log('用户数据写入成功');
            }
            res();
        });
    }).then(() => {
        for (let i = 0; i < productName.length; i++) {
            let productTable = new productModel({
                id: i + 20,
                icon: './static/imgs/products/' + (i+1) + '.jpg',
                name: productName[i],
                price: i * 87 + 218 + '元',
                postage: 15 + '元'
            });
            productTable.save((err, table) => {
                if (err) {
                    console.error('数据已存在');
                } else {
                    console.log('商品数据写入成功');
                }

            });
        }
    }).then(() => {
        console.log('数据库数据初始化完毕！');
    })
});
