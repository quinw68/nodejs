var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
module.exports={
    development:{
        db: 'mongodb://localhost/terraineditor',
        rootPath: rootPath,
        port: process.env.PORT || 8080
    },
    production:{
        rootPath: rootPath,
        port: process.env.PORT || 80
    }
}