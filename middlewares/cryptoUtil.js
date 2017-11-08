/**
 * Created by Zaaksam on 2015/8/3.
 */
var crypto = require('crypto'),
    Buffer = require('buffer').Buffer;

/**
 * 对输入内容进行SHA1加密
 * @param str
 * @returns {*}
 */
exports.sha1 = function(str) {
    var result = str;
    var sha1 = crypto.createHash('sha1');
    result = sha1.update(result, 'utf8').digest('hex');

    return result;
};

/**
 * 对输入内容进行MD5加密
 * @param str
 * @returns {*}
 */
exports.md5 = function (str) {
    //需要使用 binary 才可以一致，还可以使用 utf8，ascii
    //var buf = new Buffer(1024);
    //var len = buf.write(str, 0);
    //var result = buf.toString('binary', 0, len);


    var result = str;
    var md5 = crypto.createHash('md5');
    result = md5.update(result, 'utf8').digest('hex');
    return result;

 /*
    console.log('xxxsdfadf');
    str = (new Buffer(str,'utf8')).toString("hex");
    var ret = crypto.createHash('md5').update(str,'hex').digest("hex");
    return ret;
    */
};

/**
 * 对输入内容进行AES加密
 * @param str
 * @param password
 * @returns {string}
 */
function aesEncrypt(str, password) {
    var key = password;
    var vi = password;
    var algorithm = 'aes-128-cbc';
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';

    var oldBuff = new Buffer(str);
    var cipherLength = oldBuff.length;
    var blockSize = 16;
    // if (cipherLength % blockSize != 0) {
    //     cipherLength = cipherLength + (blockSize - (cipherLength % blockSize));
    // }
    var diff = blockSize - (cipherLength % blockSize);
    if(diff > 0){
        cipherLength = cipherLength + diff;
    }

    var newBuff = new Buffer(cipherLength);
    for (var i = 0; i < oldBuff.length; i++) {
        newBuff[i] = oldBuff[i];
    }
    for (var j = oldBuff.length; j< newBuff.length; j ++) {
        newBuff[j] = 0x0;
    }

    var cipher = crypto.createCipheriv(algorithm, key, vi);
    cipher.setAutoPadding(false);

    var cipherChunks = [];
    cipherChunks.push(cipher.update(newBuff, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));

    return cipherChunks.join('');
};

/**
 * 对输入内容进行AES解密
 * @param str
 * @param password
 * @returns {string}
 */
function aesDecrypt(str, password) {
    var commonUtil = require('../general/utils/commonUtil');

    var key = password;
    var vi = password;
    var algorithm = 'aes-128-cbc';
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';

    var decipher = crypto.createDecipheriv(algorithm, key, vi);
    decipher.setAutoPadding(false);

    var plainChunks = [];
    plainChunks.push(decipher.update(str, cipherEncoding, clearEncoding));
    plainChunks.push(decipher.final(clearEncoding));

    return commonUtil.replace(plainChunks.join(''), '\u0000', '');

    //for (var i = 0; i < cipherChunks.length; i++) {
    //    plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
    //}
    //plainChunks.push(decipher.final(clearEncoding));
};

exports.aesEncrypt =aesEncrypt;
exports.aesDecrypt =aesDecrypt;

exports.aesEncryptStr=function(str){
    return aesEncrypt(str,C.pawkey);
};
exports.aesDecryptStr=function(str){
    return aesDecrypt(str,C.pawkey);
};