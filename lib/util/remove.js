const logger = require('./../logger')
const readline = require('readline')
const fs = require('fs')
const rimraf = require('rimraf')
function removeHandler(conf) {
    const {
        root,
        rPath,
        destPath
    } = conf
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return rl.question(`⚠️  您当前正在进行删除操作\n⚠️  删除路径：${destPath}\n⚠️  是否继续,Yes or No?`.red, answer => {
        if (answer.toUpperCase() === "YES" || answer.toUpperCase() === "Y") {
            if (/^pages/.test(rPath)) {
                const appPath = `${root}/src/app.json`;
                const appConfig = JSON.parse(fs.readFileSync(appPath, { encoding: "utf-8" }));
                let index = 0;
                for (const item of appConfig.pages) {
                    if (item === `${rPath}/index`) {
                        appConfig.pages.splice(index, 1);
                        break;
                    }
                    index++
                }
                const appConfigStr = JSON.stringify(appConfig, null, "\t");
                fs.writeFileSync(appPath, appConfigStr)
            }
            const start = +new Date()
            rimraf.sync(destPath)
            logger.info(`❕ 删除成功: ${rPath}`.gray);
            logger.info(`❕ 耗时: ${(+new Date() - start) / 1000}ms`.gray);
        }
        process.exit(0)
    })
}
module.exports = removeHandler