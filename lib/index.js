var hapi = require('commander');
var pkg = require('./../package.json');
var createProjectByTpl = require('./createProjectByTpl')
var HapiUtil = require('./hapi')
var readline = require('readline');
var inquirer = require('inquirer');
; require('colors');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let pkg_config = {
    name: '',
    version: '',
    description: '',
    author: '',
    license: '',
    linkSl: true
}
hapi
    .version(pkg.version, '-v, --version')
hapi.option('-c, --component <value>', '配置组件模版路径')
hapi.option('-p, --page <value>', '配置页面模版路径')
hapi
    .command('new <name>')
    .description('创建一个组件模版(new xx)')
    .action(function (name) {
        const Hapi = new HapiUtil(Object.assign({ name },
            hapi.component ? { templateDir: hapi.component } : {}
        ))
        Hapi.build('components')
    })
hapi
    .command('create <name>')
    .description('创建一个页面模版(create xx)')
    .action(function (name) {
        const Hapi = new HapiUtil(Object.assign({ name },
            hapi.page ? { templateDir: hapi.page } : {}
        ))
        Hapi.build('pages')
    })
hapi
    .command('rm <path>')
    .description('删除指定路径模块(rm pages/x)')
    .action(function (path) {
        const Hapi = new HapiUtil({ path })
        Hapi.remove()
    })
hapi
    .command('api')
    .option('-m, --mock', '是否需要生成mock数据')
    .option('-u, --forwardUrl <value>', '配置forwardUrl')
    .option('-i, --index <value>', '根据索引从api文件中筛选需要生成API函数的队列')
    .option('-f, --file <value>', '配置源api文件路径')
    .description('根据YApi生成Ajax请求函数')
    .action(function (cmd) {
        const { mock, forwardUrl, index, file } = cmd
        const Hapi = new HapiUtil({
            mock,
            forwardUrl,
            index,
            file
        })
        Hapi.api()
    })
hapi
    .command('init <name>')
    .description('根据模版初始化工程项目')
    .action(function (arg) {
        question('👽  工程名称 Name', arg, function (ans) {
            pkg_config.name = ans
            question('🐱  工程描述 Description', 'A Alipays Mini Program', function (ans) {
                pkg_config.description = ans;
                question('🦓  工程版本 Version', '1.0.0', function (ans) {
                    pkg_config.version = ans;
                    question('👨  作者 Author', '', function (ans) {
                        pkg_config.author = ans
                        question('📄  许可证 License', 'MIT', function (ans) {
                            pkg_config.license = ans
                            question('🏠  是否创建工程？', 'yes', function (ans) {
                                if (ans.toUpperCase() === 'YES' || ans.toUpperCase() === 'Y') {
                                    inquirer
                                        .prompt([{
                                            type: 'list',
                                            message: '📦   请选择模版类型：(Use arrow keys)',
                                            name: 'type',
                                            choices: [
                                                "Alimini",
                                                "Taro"
                                            ]
                                        }])
                                        .then(answers => {
                                            pkg_config.frame_type = answers.type.toLowerCase()
                                            createProjectByTpl(pkg_config)
                                        });
                                } else {
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
    rl.question('? '.green + quest + (arg ? '(' + arg.gray + ')' : '') + '：', ans => {
        callback instanceof Function && callback(ans || arg)
    })
}