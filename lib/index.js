var hapi = require("commander");
var pkg = require("./../package.json");
var createProjectByTpl = require("./createProjectByTpl")
var readline = require("readline");
; require("colors");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let pkg_config = {
    name: "",
    version: "",
    description: "",
    author: "",
    license: ""
}
hapi
    .version(pkg.version, "-v, --version")
    .command("init <name>")
    .description("根据模版初始化工程项目")
    .action(function (arg) {
        question("工程名称 Name", arg, function (ans) {
            pkg_config.name = ans
            question("工程描述 Description", "A Alipays Mini Program", function (ans) {
                pkg_config.description = ans;
                question("工程版本 Version", "1.0.0", function (ans) {
                    pkg_config.version = ans;
                    question("作者 Author", "", function (ans) {
                        pkg_config.author = ans
                        question("许可证 License", "MIT", function (ans) {
                            pkg_config.license = ans
                            question("是否创建工程？", "yes", function (ans) {
                                if (ans.toUpperCase() === "YES" || ans.toUpperCase() === "Y") {
                                    createProjectByTpl(pkg_config)
                                }else {
                                    process.exit(0)
                                }
                            })
                        })
                    })
                })

            })
        })

    })
hapi.parse(process.argv)


function question(quest, arg, callback) {
    rl.question("? ".green + quest + (arg ? "(" + arg.gray + ")" : "") + "：", ans => {
        callback instanceof Function && callback(ans || arg)
    })
}