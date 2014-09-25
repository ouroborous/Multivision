var mongoose = require('mongoose'),
    crypto = require('crypto');

module.exports = function(config){
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback(){
        console.log('multivision db opened');
    });
    var userSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        username: String,
        salt: String,
        hashed_pwd: String
    });
    userSchema.methods = {
        authenticate: function(passwordToMatch){
            return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
        }
    }
    var User = mongoose.model('User', userSchema);

    User.find({}).exec(function(err, collection){
        if(collection.length === 0){
            var salt, hash;
            salt = createSalt();
            hash = hashPwd(salt, 'lil');
            User.create({firstName: 'Lilit', lastName: 'Baghunts', username: 'lil', salt: salt, hashed_pwd: hash});
            salt = createSalt();
            hash = hashPwd(salt, 'jane');
            User.create({firstName: 'Jane', lastName: 'Murphy', username: 'jane', salt: salt, hashed_pwd: hash});
            salt = createSalt();
            hash = hashPwd(salt, 'soki');
            User.create({firstName: 'Sooki', lastName: 'Stack', username: 'soki', salt: salt, hashed_pwd: hash});
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