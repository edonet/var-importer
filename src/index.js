/**
 *****************************************
 * Created by lifx
 * Created on 2017-09-12 10:19:16
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    path = require('path'),
    sassify = require('./sassify'),
    resolveAlias = require('./resolveAlias'),
    resolveFile = require('./resolveFile'),
    regexp = /\.js(\?.+)?$/;


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = ({ data, alias, test = regexp } = {}) => {

    // 生成别名解析器
    alias = resolveAlias(alias);

    // 返回【sass】加载器
    return (url, context, callback) => {

        // 坐配置中获取
        if (data && url in data) {
            return callback({ contents: sassify(data[url]) });
        }

        // 处理配置文件
        if (test.test(url)) {

            let name = alias(url);

            // 替换别名
            if (name.startsWith('~')) {
                return callback(name);
            }

            // 获取文件路径
            name = path.resolve(path.dirname(context), name);

            // 加载文件
            return resolveFile(name, (err, data) => {

                // 返回错误
                if (err) {
                    return callback(err);
                }

                // 解析数据
                return callback({ contents: sassify(data) });
            });
        }

        // 返回源路径
        return callback(url);
    };
};


/**
 *****************************************
 * 抛出工具函数
 *****************************************
 */
module.exports.sassify = sassify;
module.exports.resolveFile = resolveFile;
module.exports.resolveAlias = resolveAlias;
