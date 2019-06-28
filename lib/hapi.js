const gulp = require('gulp')
const gulpif = require('gulp-if')
const fs = require('fs')
const readline = require('readline')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const path = require("path")
const pump = require('pump')
const logger = require('./logger')
    ; require("colors");

const apiFuncTemplateFactory = require("./apifunc_template")
const root = process.cwd();
let apiCount = 0, totalCount = 0;
function HapiUtil(config) {
    this.name = config.name || ""
    this.path = config.path || ""
    const apisDest = config.filePath ? config.filePath : `${root}/api.json`
    if (fs.existsSync(apisDest)) {
        this.apis = require(apisDest)
    }
    this.beforeApiFileName = []
    this.templateDir = config.templateDir
    this.config = config
    this.anazApis = function anazApis(api) {
        const config = this.config;
        const { mock } = config
        const method = api.method
        const path = api.path
        let headers = {}
        if (api.req_headers && api.req_headers.length) {
            for (const item of api.req_headers) {
                headers[item.name] = item.value
            }
        }
        if (config && config.forwardUrl) {
            headers["forwardUrl"] = config.forwardUrl
        }
        const paths = (path.replace(/^\//, "")).split('/')
        const funcName = paths[paths.length - 1]
        const dataType = api.res_body_type
        const options = {
            headers: headers,
            method,
            dataType
        }
        let dirPath, mockPath, fileName
        dirPath = `${root}/src/components/api/`
        if (paths.length - 3 >= 0) {
            dirPath += `${paths.length - 2 === 1 ? paths.slice(0, paths.length - 2) + "/" : paths.slice(0, paths.length - 2).join('/') + "/"}`
        }
        if (mock) {
            // 生成 mock 数据
            mockPath = `${root}/dist/mock/`
            if (paths.length > 1) mockPath += paths.slice(0, paths.length - 1).join("/")
            fileName = paths[paths.length - 1];
        }
        ; (new MockFactory(mockPath, fileName, api.res_body)).build((mockData) => {
            const content = apiFuncTemplateFactory(funcName, path, options, mock, mockData);
            mkdirp(dirPath, err => {
                if (err) logger.error(err)
                else {
                    const fileName = paths.length - 2 >= 0 ? paths[paths.length - 2] : 'api'
                    const filePath = `${dirPath.concat(`${fileName}`)}.js`
                    const fileExist = (this.beforeApiFileName.findIndex(item => item == filePath) > -1)
                    const fileContent = (!this.beforeApiFileName.length || !fileExist) ? `
import CONSTANTS from "/components/_constants/index"
${content}
`: content
                    !fileExist && (this.beforeApiFileName.push(filePath))
                    fs.appendFile(filePath, fileContent, 'utf-8', error => {
                        if (error) logger.error(error)
                        apiCount ++;
                        logger.info(`>> 构建完成（${apiCount}/${totalCount}） << ${filePath}`.green)
                        if(apiCount === totalCount) {
                            console.log("======API 构建完成======".yellow);
                            console.log(`导入api：${totalCount} 个`);
                            console.log(`创建成功：${apiCount} 个`);
                            console.log("=========0.0===========".yellow);
                            process.exit(0)
                        }
                    })
                }
            })
        })
    }

    function MockFactory(path, fileName, resBody) {
        this.path = path;
        this.fileName = fileName;
        this.resBody = resBody;
    }
    MockFactory.prototype = {
        build: function (callback) {
            if (!this.path) {
                callback instanceof Function && callback()
                return
            }
            mkdirp(this.path, err => {
                if (err) console.error(err)
                else {
                    const content = this.buildMockData(JSON.parse(this.resBody)).replace(/\\\"/g, "")
                    const fw = fs.createWriteStream(`${this.path.concat(`/${this.fileName}`)}.json`, {
                        flags: 'w',
                        defaultEncoding: 'utf8',
                    })
                    fw.write(content, () => {
                        callback instanceof Function && callback(content)
                        fw.close()
                    })
                }
            })
        },
        buildValueByDataType: function (key, dataObj) {
            const type = dataObj.type;
            switch (type) {
                case "string":
                    return `"${key}_${Math.floor(Math.random() * 10)}"`;
                case "number":
                    return Math.floor(Math.random() * 10);
                case "array":
                    let a_result = new Array()
                    const items = dataObj.items;
                    const count = Math.floor(Math.random() * 15)
                    for (let i = 0; i < count; i++) {
                        a_result.push(this.buildValueByDataType(null, items))
                    }
                    return a_result;
                case "object":
                    let o_result = new Object()
                    const properties = dataObj.properties;
                    for (const key in properties) {
                        o_result[key] = this.buildValueByDataType(key, properties[key])
                    }
                    return o_result;
                default:
                    return null;
            }
        },
        buildMockData: function (body) {
            let result = {}
            try {
                const properties = body.properties;
                if (!properties) {
                    result = {
                        "code": 0,
                        "msg": "mock请求成功",
                        "success": true
                    }
                } else {
                    const data = properties["data"];
                    let obj = new Object()
                    if (data) obj = this.buildValueByDataType("data", data)
                    result = {
                        "code": 0,
                        "data": data ? obj : null,
                        "msg": "mock请求成功",
                        "success": true
                    }
                }
            } catch (error) {
                logger.error(error.red)
            }
            return JSON.stringify(result, null, 4)
        }
    }
}
HapiUtil.prototype = {
    build: async function (type) {
        try {
            const name = this.name
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
            return pump([
                gulp.src(srcPath),
                gulpif(!hasExist,
                    gulp
                        .dest(destPath)
                        .on("end", function () {
                            const lessFile = fs.readFileSync(`${destPath}/index.less`, { encoding: "utf-8" });
                            fs.writeFileSync(`${destPath}/index.less`, lessFile.replace(/\.hp-_template/g, `.${fileName.toLowerCase()}`))
                            const axmlFile = fs.readFileSync(`${destPath}/index.axml`, { encoding: "utf-8" });
                            fs.writeFileSync(`${destPath}/index.axml`, axmlFile.replace(/hp-_template/g, fileName.toLowerCase()))
                            if (type === "components") {
                                const pkgFile = fs.readFileSync(`${destPath}/package.json`, { encoding: "utf-8" });
                                fs.writeFileSync(`${destPath}/package.json`, pkgFile.replace(/_template/g, fileName.toLowerCase()))
                            }
                            logger.info(`创建成功: ${type}/${fileName}`.green);
                            logger.info(`耗时: ${(+new Date() - start) / 1000}ms`.green);
                            process.exit(0)
                        }))
                    .on("error", function (err) {
                        logger.error(err.red)
                        process.exit(0)
                    })
            ])
        } catch (error) {
            logger.error(error.red)
            process.exit(0)
        }
    },
    remove: async function () {
        try {
            const rPath = this.path
            const destPath = `${root}/src/${rPath}`
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            })
            return rl.question(`您当前正在进行删除操作\n删除路径：${destPath}\n是否继续,Yes or No?`.red, answer => {
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
                    logger.info(`删除成功: ${rPath}`.green);
                    logger.info(`耗时: ${(+new Date() - start) / 1000}ms`.green);
                }
                process.exit(0)
            })
        } catch (error) {
            logger.error(error)
        }
    },
    api: async function () {
        logger.info(`1.初始化api生成目录`.green)
        rimraf.sync(`${root}/src/components/api`)
        rimraf.sync(`${root}/dist/mock`)
        logger.info(`2.初始化完成，开始构建`.green)
        const apis = this.apis;
        const { index } = this.config
        let _apis = apis
        if (index !== undefined && apis[index]) {
            _apis = apis[index]
        }
        const _apiArr = (_apis instanceof Array ? _apis : [_apis])
        let result = []
        for (const item of _apiArr) {
            result = result.concat(item.list)
        }
        totalCount = result.length
        for (let i = 0; i < result.length; i++) {
            this.anazApis(result[i])
        }
    }
}
module.exports = HapiUtil