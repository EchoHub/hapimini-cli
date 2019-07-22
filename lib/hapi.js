const fs = require('fs')
const logger = require('./logger')
;require("colors")

const removeHandler = require('./util/remove')
const apiGenerator = require('./util/apiGenerator')
const buildByTpl = require("./util/buildByTpl")
const root = process.cwd()
function HapiUtil(config) {
    this.name = config.name || ""
    this.path = config.path || ""
    const apisDest = config.filePath ? config.filePath : `${root}/api.json`
    if (fs.existsSync(apisDest)) {
        this.apis = require(apisDest)
    }
    this.templateDir = config.templateDir
    this.config = config
}
HapiUtil.prototype = {
    build: async function (type) {
        try {
            const conf = {
                name: this.name,
                type,
                root,
            }
            buildByTpl(conf)
        } catch (error) {
            logger.error(error.red)
            process.exit(0)
        }
    },
    remove: async function () {
        try {
            const rPath = this.path
            const conf = {
                root,
                rPath,
                destPath: `${root}/src/${rPath}`
            }
            removeHandler(conf)
        } catch (error) {
            logger.error(error)
            process.exit(0)
        }
    },
    api: async function () {
        try {
            const conf = {
                root,
                apis: this.apis,
                config: this.config
            }
            apiGenerator(conf)
        } catch (error) {
            logger.error(error)
            process.exit(0)
        }
    }
}
module.exports = HapiUtil