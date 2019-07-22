const path = require('path')
const pump = require('pump')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const fs = require('fs')
const logger = require('./../logger')
function buildByTpl(conf) {
    const {
        name,
        type,
        root,
    } = conf
    const nameArr = name.split('/')
    const fileName = nameArr[nameArr.length - 1]
    let filePath = null
    if (nameArr.length > 1) {
        filePath = nameArr.slice(0, nameArr.length - 1).join('/')
    }
    const destPath = `${root}/src/${type}/${filePath ? `${filePath}/${fileName}` : fileName}`
    const hasExist = fs.existsSync(destPath);
    if (!hasExist && type === "pages") {
        const appPath = `${root}/src/app.json`;
        const appConfig = JSON.parse(fs.readFileSync(appPath, { encoding: "utf-8" }));
        appConfig.pages.push(`pages/${filePath ? `${filePath}/${fileName}` : fileName}/index`)
        const appConfigStr = JSON.stringify(appConfig, null, "\t");
        fs.writeFileSync(appPath, appConfigStr)
    }
    const start = +new Date()
    let srcPath = ""
    if (this.templateDir) {
        srcPath = `${this.templateDir}/*.*`
    } else {
        srcPath = `${root}/src/${type}/_template/*.*`;
        if (!fs.existsSync(`${root}/src/${type}/_template/index.js`)) {
            srcPath = path.resolve(root, `./../sl-miniapp/src/${type}/_template/*.*`)
        }
    }
    if(hasExist) {
        logger.error("⚠️  创建失败，文件已存在 ！！！".gray)
        process.exit(0)
        return
    }
    return pump([
        gulp.src(srcPath),
        gulpif(!hasExist,
            gulp
                .dest(destPath)
                .on("end", function () {
                    const jsFile = fs.readFileSync(`${destPath}/index.js`, { encoding: "utf-8" });
                    fs.writeFileSync(`${destPath}/index.js`, jsFile.replace(/hp-_template/g, `${fileName.toLowerCase()}`))
                    const lessFile = fs.readFileSync(`${destPath}/index.less`, { encoding: "utf-8" });
                    fs.writeFileSync(`${destPath}/index.less`, lessFile.replace(/\.hp-_template/g, `.${fileName.toLowerCase()}`))
                    const axmlFile = fs.readFileSync(`${destPath}/index.axml`, { encoding: "utf-8" });
                    fs.writeFileSync(`${destPath}/index.axml`, axmlFile.replace(/hp-_template/g, fileName.toLowerCase()))
                    if (type === "components") {
                        const pkgFile = fs.readFileSync(`${destPath}/package.json`, { encoding: "utf-8" });
                        fs.writeFileSync(`${destPath}/package.json`, pkgFile.replace(/_template/g, fileName.toLowerCase()))
                    }
                    logger.info(`😄  创建成功: ${type}/${name}`.green);
                    logger.info(`😄  耗时: ${(+new Date() - start) / 1000}ms`.green);
                    process.exit(0)
                })
            .on("error", function (err) {
                logger.error(err.red)
                process.exit(0)
            })
        )
    ])
}
module.exports = buildByTpl