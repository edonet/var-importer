/**
 *****************************************
 * Created by lifx
 * Created on 2017-09-12 10:16:26
 *****************************************
 */
'use strict';



/**
 *****************************************
 * 将对象解析为【sass】变量
 *****************************************
 */
function sassify(data) {

    // 返回字符串
    if (typeof data === 'string') {
        return data;
    }

    // 处理对象
    if (typeof data === 'object') {

        // 处理数组
        if (Array.isArray(data)) {
            return data.map(sassify).join('\n');
        }

        let keys = Object.keys(data),
            code = '';

        for (let name of keys) {
            code += `$${ name }: ${ data[name] };\n`;
        }

        return code;
    }

    // 默认为空
    return '';
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = sassify;
