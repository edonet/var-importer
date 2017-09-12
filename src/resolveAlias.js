/**
 *****************************************
 * Created by lifx
 * Created on 2017-08-14 16:33:32
 *****************************************
 */
'use strict';


/**
 *************************************
 * 加载依赖
 *************************************
 */
const
    os = require('os'),
    home = os.homedir();


/**
 *************************************
 * 抛出接口
 *************************************
 */
module.exports = alias => {

    // 如果为解析函数
    if (typeof alias === 'function') {
        return alias;
    }

    // 找不到别名
    if(typeof alias !== 'object' || Array.isArray(alias)) {
        return function(url) {
            return url.startsWith('~/') ? (home + url.slice(1)) : url;
        };
    }

    // 生成别名列表
    alias = Object.keys(alias).map(key => {
        let patt = {
                name: key,
                alias: alias[key],
                test: url => url === key || url.startsWith(key + '/')
            };


        // 判断是否完全配置
        if (/\$$/.test(key)) {
            patt.name = key.slice(0, -1);
            patt.test = url => url === patt.name;
        }

        // 返回配置对象
        return patt;
    });


    // 返回别名函数
    return function(url) {

        // 替换用户
        if (url.startsWith('~/')) {
            return home + url.slice(1);
        }

        let path = url.slice(1);


        // 查找别名
        for (let patt of alias) {
            if (patt.test(path)) {
                return patt.alias + path.substr(patt.name.length);
            }
        }

        // 返回路径
        return url;
    };
};
