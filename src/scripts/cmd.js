/*
 * @Descripttion: 
 * @Author: amplee
 * @Date: 2021-02-22 17:07:05
 * @LastEditors: amplee
 * @LastEditTime: 2021-02-22 17:15:36
 */
// 'use strict';
// const fs = require('fs');
// const path = require('path');
// const program = require('commander');

// let argv;
// try {
//   // 通过 npm run server 的方法执行的时候，参数更换获取方式
//   argv = JSON.parse(process.env.npm_config_argv).original;
// }	catch (e) {
//   argv = process.argv;
// }

// program
//   .option('-d, --dirname <dirname>', '编译目录')
//   .option('-o, --outdir [outdir]', '编译到指定目录')
//   .option('-p, --port [port]', '端口号')
//   .parse(argv);


// if (!program.dirname) {
//   // 如果命令，是从子目录运行的，允许不输入目录
//   const dirname = path.relative(__dirname, process.env.INIT_CWD);
//   if (dirname && !/^\./.test(dirname)) {
//     program.dirname = dirname;
//   }

//   if (!program.dirname) {
//     throw '请输入项目名字（如 --dirname=xyq）';
//   }
// }

// const dirname = program.dirname;
// if (!fs.existsSync( path.resolve(__dirname, '../', dirname) )) {
//   throw `项目 ${dirname} 不存在`;
// }

// module.exports = program;
