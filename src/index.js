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
    fs = require('fs'),
    path = require('path'),
    sassify = require('./sassify'),
    resolveAlias = require('./resolveAlias'),
    resolveFile = require('./resolveFile');


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = ({ data, alias, callback } = {}) => {

    // 生成别名解析器
    alias = resolveAlias(alias);

    // 返回【sass】加载器
    return (url, context, cb) => {

        // 坐配置中获取
        if (data && url in data) {
            return cb({ contents: sassify(data[url]) });
        }

        // 替换别名
        let name = alias(url);

        // 处理用户目录
        if (name.startsWith('~')) {
            return cb(name);
        }

        // 获取文件路径
        name = path.resolve(path.dirname(context), name);

        // 处理【json】文件
        if (name.endsWith('.json')) {
            return fs.readFile(name, (err, data) => {

                // 返回错误信息
                if (err) {
                    return cb({ file: name, contents: '' });
                }

                // 转换数据
                try {
                    return cb({ file: name, contents: sassify(JSON.parse(data)) });
                } catch (err) {
                    return cb(err);
                }
            });
        }

        // 处理【js】文件
        if (name.endsWith('.js')) {

            // 加载文件
            return resolveFile(name, (err, data) => {

                // 返回错误
                if (err) {
                    return cb({ file: name, contents: '' });
                }

                // 执行成功回调
                callback && callback(name, data);

                // 解析数据
                return cb({ file: name, contents: sassify(data) });
            });
        }

        // 返回源路径
        return cb(url);
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
