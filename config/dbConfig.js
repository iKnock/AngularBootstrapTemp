var mysql = require('mysql');

var connection = mysql.createConnection({ 
  host : 'localhost',
  database: 'db_temp',
  port: '3306',
  user : 'root',
  password : '',
  insecureAuth: true
});
    connection.connect(function(err){
        if(err != null) {
            res.end('Error connecting to mysql:' + err+'\n');
        }
    });

module.exports = connection;