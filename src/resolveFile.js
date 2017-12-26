/**
 *****************************************
 * Created by lifx
 * Created on 2017-09-12 10:53:17
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    vm = require('vm'),
    path = require('path'),
    babel = require('babel-core'),
    babelOptions = {
        ast: false,
        babelrc: false,
        env: process.env,
        plugins: [
            'transform-es2015-modules-commonjs'
        ]
    };


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = (src, callback) => {

    // 加载文件
    return babel.transformFile(src, babelOptions, (err, res) => {

        // 返回错误
        if (err) {
            return callback(err);
        }

        // 编译模块
        let script = new vm.Script(res.code),
            model = { exports: {} },
            sandbox = {
                require,
                module: model,
                exports: model.exports,
                __filename: src,
                __dirname: path.dirname(src)
            },
            context = vm.createContext(sandbox);


        // 解析数据
        callback(null, script.runInNewContext(context));
    });
};
