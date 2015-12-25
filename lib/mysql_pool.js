var fs = require(fs);
var yaml = require (js-yaml);
var wrapper = require (co-mysql);
var mysql = require (mysql);
var mysql_conf = yaml.safeLoad(fs.readFileSync('etc/mysql.yaml', 'utf8'));

console.log mysql_conf

pool = mysql.createPool(mysql_conf.mysql);
p = wrapper(pool);

exports.mysql = mysql
exports.p = p
