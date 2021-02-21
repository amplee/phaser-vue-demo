/*
 * @Descripttion: 资源映射
 * @Author: amplee
 * @Date: 2021-02-08 14:29:00
 * @LastEditors: amplee
 * @LastEditTime: 2021-02-08 15:00:02
 */
const fs = require('fs');
const path = require('path');

const assetsList = fs.readdirSync(path.resolve(__dirname, 'src/assets/'));

const assetsMap = {};
assetsList.forEach((item) => {
    const key = item.match(/.\w+/)[0];
    Object.assign(assetsMap, {
        [key]: `assets/${item}`
    });
});
fs.writeFileSync(path.resolve(__dirname, 'src/assets_map.json'), JSON.stringify(assetsMap))