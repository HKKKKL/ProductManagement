const mongoose = require('mongoose');

function __connectDB() {
    mongoose.connect('mongodb://127.0.0.1:27017/' + 'productManagement', {useNewUrlParser: true});
    let db = mongoose.connection;
    db.on('error', function () {
        console.error.bind(console, 'connection error:');
    });
}

function find(model, condition, callback) {
    __connectDB();
    model.find(condition, function (err, data) {
        if (err) return console.log(err);
        callback(data);
    })
}

function save(data,callback) {
    __connectDB();
    data.save(err => {
        if (err)console.log(err);
        callback(err);
    });
}
function deleteOne(model,condition,callback){
    __connectDB();
    model.deleteOne(condition,function(err){
        callback(err);
    });
}
function updateOne(model,condition,data,callback){
    __connectDB();
    model.updateOne(condition,data,function(err,data){
        callback(err,data);
    });
}
module.exports = {
    find,
    save,
    deleteOne,
    updateOne
};
