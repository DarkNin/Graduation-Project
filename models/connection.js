let mysql = require('mysql');
let config = require('config');


function pool(database) {
    let dbConfig = config.get('database');
    return mysql.createPool({
        connectionLimit: 100,
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: database
    });
}

//insert
function insertMsg(obj) {
    let options = {
        sql: 'INSERT INTO barrage(id, date, time, type, color, user,content, x, y, vx) VALUES' +
        '(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        timeout: 4000,
        values: [obj.date, obj.time, obj.type, obj.color, obj.user, obj.content, obj.x, obj.y, obj.vx]
    };
    pool('video').getConnection((err, connection) => {
        connection.query(options, (err, results, fields) => {
            //console.log('\n' + err + '///' + results + '///' + fields + '\n');
            connection.destroy();
        })
    });


}

//find
function selectMsg(beginTime) {
    let options = {
        sql: 'SELECT * FROM barrage ORDER BY time',
        timeout: 4000
    };
    let barrage = [];
    return new Promise((resolve, reject) => {
        pool('video').getConnection((err, connection) => {
            connection.query(options,(err, results) => {
                if (err){
                    reject(err);
                }
                for (let i = 0; i < results.length; i ++){
                    barrage.push(results[i]);
                }
                let index = barrage.indexOf(barrage.find((val) => {
                    return val.time >= beginTime;
                }));
                if (index !== -1) {
                    barrage = barrage.slice(index);
                } else {
                    barrage = [];
                }
                resolve(barrage);
                connection.release();
            })
        });
    });
}
function findAccount(usr) {
    let options = {
        sql: 'SELECT * FROM user WHERE name = ?',
        timeout: 4000,
        values: [usr.name]
    };
    return new Promise((resolve, reject) => {
        pool('video').getConnection((err, connection) => {
            connection.query(options, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
                connection.destroy();
            })
        })
    })
}
function createAccount(usr) {
    let options = {
        sql: 'INSERT INTO user(id, date, name, password, timeStamp) VALUES (NULL, ?, ?, ?, ?)',
        timeout: 4000,
        values: [usr.date, usr.name, usr.password, usr.timeStamp]
    };
    return new Promise((resolve, reject) => {
        pool('video').getConnection((err, connection) => {
            connection.query(options, (err, results) => {
                if (err) {
                    reject(err);
                }
                resolve(results);
                connection.destroy();
            })
        })
    })
}

// connection.end(function (err) {
//     console.log(err);
// });
exports.pool = pool;
exports.insertMsg = insertMsg;
exports.selectMsg = selectMsg;
exports.createAccount = createAccount;
exports.findAccount = findAccount;