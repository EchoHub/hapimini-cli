const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')
const logger = require('./../logger')
const mkdirp = require('mkdirp')
const buildApiCommonFunc = require("./api/apiCommonFunc")
let beforeApiFileName =[], apiCount = 0, totalCount = 0;
function anazApis(conf) {
    const {
        root,
        config,
        api
    } = conf
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
        mkdirp(dirPath, err => {
            if (err) logger.error(err)
            else {
                const fileName = paths.length - 2 >= 0 ? paths[paths.length - 2] : 'api'
                const filePath = `${dirPath.concat(`${fileName}`)}.js`
                const fileExist = (beforeApiFileName.findIndex(item => item == filePath) > -1)
                const hasImportConst = (!beforeApiFileName.length || !fileExist)
                const fileContent = `${buildApiCommonFunc({
                    funcName, 
                    path, 
                    options, 
                    mock, 
                    mockData,
                    hasImportConst
                })}`
                !fileExist && (beforeApiFileName.push(filePath))
                fs.appendFile(filePath, fileContent, 'utf-8', error => {
                    if (error) logger.error(error)
                    apiCount++;
                    console.log(`>> 构建完成（${apiCount}/${totalCount}） << ${filePath}`.gray)
                    if (apiCount === totalCount) {
                        console.log("======API 构建完成======".yellow);
                        console.log(`❕ 导入api：${totalCount} 个`.green);
                        console.log(`❕ 创建成功：${apiCount} 个`.green);
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
function apiGenerator(conf) {
    const {
        root,
        apis,
        config
    } = conf
    logger.info(`❕初始化api生成目录`.green)
    rimraf.sync(`❕${root}/src/components/api`)
    rimraf.sync(`❕${root}/dist/mock`)
    logger.info(`❕初始化完成，开始构建`.green)
    const { index } = config
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
    const _api_path = path.resolve(__dirname, "./../api/_api_.js")
    const api_$root = `${root}/src/components/api`
    mkdirp(api_$root, err => {
        if (err) logger.error(err)
        const _api_content = fs.readFileSync(_api_path)
        fs.writeFileSync(`${api_$root}/_api_.js`, _api_content);
        for (let i = 0; i < result.length; i++) {
            anazApis({
                root,
                config,
                api: result[i]
            })
        }
    })
}
module.exports = apiGenerator