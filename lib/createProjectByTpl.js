var cloner = require("hapiclone");
var path = require("path")
var fs = require("fs")
    ; require("colors")

function printInfo(config) {
    console.log("==========创建成功==========".yellow);
    console.log("🐎  名称：".green, config.name);
    console.log("🐎  描述：".green, config.description)
    console.log("🐎  版本：".green, config.version)
    console.log("🐎  作者：".green, config.author)
    console.log("===========================".yellow);
}
module.exports = function createProjectByTpl(config) {
    if (fs.existsSync(path.resolve(process.cwd(), "./" + config.name))) {
        console.log("创建失败，项目已存在".red);
        process.exit(0)
        return
    }
    var cloneman = new cloner(path.resolve(__dirname, config.frame_type == "taro" ? "./template/_taro":
        config.linkSl ? "./template/_tpl" : "./template/_tpl2"
        ), "./" + config.name);
    cloneman.clone();
    var timer = setTimeout(() => {
        var url = path.resolve(process.cwd(), config.name) + "/package.json"
        var info = JSON.parse(fs.readFileSync(url, { encoding: 'utf8' }));
        info.name = config.name;
        info.description = config.description;
        info.version = config.version;
        info.author = config.author;
        info.license = config.license;
        fs.writeFileSync(url, JSON.stringify(info, null, 4), { encoding: 'utf-8' })
        printInfo(config);
        process.exit(0);
        clearTimeout(timer);
    }, 1000)
}