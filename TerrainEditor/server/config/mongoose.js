var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function(config){

    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback(){
        console.log('database connected');
    });

    var userSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        userName: String,
        salt: String,
        hashed_pwd: String,
        roles: [String]
    });
    userSchema.methods={
        authenticate: function(passwordToMatch){
            return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
        }
    }
    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function(err, collection){
        if(collection.length === 0){
            salt = createSalt();
            hash = hashPwd(salt, 'admin');
            User.create({
                firstName: 'Admin',
                lastName: 'User',
                userName:'admin',
                salt: salt,
                hashed_pwd: hash,
                roles: ['admin']
            });

            salt = createSalt();
            hash = hashPwd(salt, 'quin');
            User.create({
                firstName: 'Quin',
                lastName: 'Williams',
                userName:'quinw',
                salt: salt,
                hashed_pwd: hash,
                roles: []
            });
        }
    })
}

function createSalt(){
    return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd){
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}