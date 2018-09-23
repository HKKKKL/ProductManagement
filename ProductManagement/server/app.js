const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const multer = require('multer');
const path = require('path');
const userModel = require('./Model/userModel');
const productModel = require('./Model/productModel');
const DB = require('./db');

const app = express();
app.use(express.static(path.resolve(__dirname, '../dist')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(session({
    secret: 'asfsdgffdsa',
    name: 'user_sid',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, maxAge: 60 * 1000 * 60},
    store: new MongoStore({
        url: 'mongodb://127.0.0.1:27017/sessionStore',
        touchAfter: 24 * 3600 //秒为单位,用户刷新时如果不改变数据则会 24 小时之内只会更新一次数据库 session 。
    })
}));

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('../dist/static/imgs/products'));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '_' + file.originalname);
    }
});
let upload = multer({storage: storage});

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://101.132.168.38");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/logIn', (req, res) => {
    let postData = req.body;
    DB.find(userModel, postData, function (data) {
        if (data[0] && data[0].accountName === postData.accountName && data[0].password === postData.password) {
            req.session.accountName = data[0].accountName;
            res.end('management');
        } else {
            res.end();
        }
    })
});
app.post('/productList', (req, res) => {
    DB.find(productModel, {}, function (data) {
        let resData = {};
        for (let i = 0; i < data.length; i++) {
            resData[i] = data[i];
        }
        setTimeout(function () {
            res.json(resData);
        }, 200);
    })
});
app.post('/reload', function (req, res) {
    let a = req.session.accountName ? req.session.accountName.toString() : '';
    res.end(a);
});
app.post('/addProduct', upload.single('avatar'), function (req, res, next) {
    console.log('图片上传完毕');
    next();
});
app.post('/addProduct', function (req, res) {
    let newProductData = JSON.parse(req.body.newProductData);
    newProductData.id = Math.random() * 10000;
    let end = req.file.path.indexOf('\\static');
    newProductData.icon = req.file.path.slice(end,);
    newProductData.price += '元';
    newProductData.postage += '元';
    DB.save(new productModel(newProductData),function(err){
        if (err) {
            console.log('添加商品失败！', err);
            res.end();
        } else {
            console.log('新商品数据写入成功！');
            res.end('1');
        }
    })
});
app.post('/delProduct', function (req, res) {
    let name = req.body.name;
    DB.deleteOne(productModel,{name: name},function(err){
        if (err) {
            console.log('删除数据错误:' + err);
        } else {
            console.log('删除成功!');
        }
        res.end();
    })
});
app.post('/update', upload.single('updateImg'), function (req, res, next) {
    console.log('图片更新上传完毕');
    next();
});
app.post('/update', function (req, res) {
    let updateData = JSON.parse(req.body.updateData);
    if (req.file) {
        let end = req.file.path.indexOf('\\static');
        updateData.icon = req.file.path.slice(end,);
    }
    updateData.price = parseInt(updateData.price) + '元';
    updateData.postage = parseInt(updateData.postage) + '元';
    DB.updateOne(productModel,{name: updateData.originName}, updateData, function (err, data) {
        if (err) {
            console.log('更新错误！：', err);
            setTimeout(function () {
                res.end();
            }, 300);
        } else {
            console.log('更新成功！：', data);
            setTimeout(function () {
                res.end('1');
            }, 300);
        }
    })
});
app.listen(8001,function () {
    console.log('服务器运行在 http://101.132.168.38:8001');
});
