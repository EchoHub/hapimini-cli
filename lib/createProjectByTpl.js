var cloner = require("hapiclone");
var path = require("path")
var fs = require("fs")
    ; require("colors")
module.exports = function createProjectByTpl(config) {
    if (fs.existsSync(path.resolve(process.cwd(), "./" + config.name))) {
        console.log("创建失败，项目已存在".red);
        process.exit(0)
        return
    }
    var cloneman = new cloner(path.resolve(__dirname, config.linkSl ? "./_tpl" : "./_tpl2"), "./" + config.name);
    cloneman.clone();
    var timer = setTimeout(() => {
        console.log("==========创建成功==========".yellow);
        console.log("名称：".green, config.name);
        console.log("描述：".green, config.description)
        console.log("版本：".green, config.version)
        console.log("作者：".green, config.author)
        console.log("是否本地依赖SL-MINIAPP：".green, config.linkSl ? "是" : "否")
        console.log("===========================".yellow);
        process.exit(0);

        clearTimeout(timer);
    }, 1000)
}