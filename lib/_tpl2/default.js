const path = require("path")
const fs = require('fs');
const join = path.join;
const srcPath = "./src"
const NODE_ENV = process.env.NODE_ENV;
const destPath = NODE_ENV === "development" ? "./dev" : "./dist"
function findSync(startPath) {
    let entries = {};
    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach((val, index) => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile() && /\S+.js$/.test(val)) {
                const key = fPath.replace(/(^src\/([0-9a-zA-Z_\/]+)\/\S+.js$)/, "$2")
                entries[key] = fPath.replace(/\w+\.js$/, "*.js")
            }
        });
    }
    finder(startPath);
    return entries
}
function prodCompileFilter() {
    let entries = findSync('./src/pages');
    let a_componentsEntries = []
    let j_componentsEntries = []
    let l_componentsEntries = []
    for (const item in entries) {
        const jsonPath = `${entries[item]}`.replace(/\*.js$/, "index.json")
        const json = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf-8' }));
        const usingComponents = json.usingComponents || {};
        const result = entryFilesIterator(usingComponents)
        entries = {
            ...entries,
            ...result.entries
        }
        a_componentsEntries = a_componentsEntries.concat(result.a)
        j_componentsEntries = j_componentsEntries.concat(result.j)
        l_componentsEntries = l_componentsEntries.concat(result.l)
    }
    let jsDirs = [{
        src: "./src/app.js",
        dest: "./dist"
    }, {
        src: "./src/components/api/**/*.js",
        dest: "./dist/components/api",
    }, {
        src: "./src/components/_constants/*.js",
        dest: "./dist/components/_constants"
    }, {
        src: "./src/components/utils/**/*.js",
        dest: "./dist/components/utils"
    }]
    for (const key in entries) {
        jsDirs.push({
            src: entries[key],
            dest: `./dist/${key}`
        })
    }
    return {
        jsDirs,
        jsonDirs: [
            {
                src: path.resolve(srcPath, "app.json"),
                dest: destPath,
            },
            {
                src: path.resolve(srcPath, "pages/**/*.json"),
                dest: path.join(destPath, "pages"),
            }
        ].concat(j_componentsEntries),
        axmlDirs: [
            {
                src: path.resolve(srcPath, "pages/**/*.axml"),
                dest: path.join(destPath, "pages"),
            }
        ].concat(a_componentsEntries),
        lessDirs: [
            {
                src: path.resolve(srcPath, "app.less"),
                dest: destPath,
            },
            {
                src: path.resolve(srcPath, "pages/**/*.less"),
                dest: path.join(destPath, "pages"),
            },
            {
                src: path.resolve(srcPath, "assets/styles/**/*.less"),
                dest: path.join(destPath, "assets"),
            }
        ].concat(l_componentsEntries)
    }
}
function entryFilesIterator(usingComponents) {
    let entries = {}, a = [], j = [], l = []
    for (const ite in usingComponents) {
        const name = usingComponents[ite].replace(/^\//, "")
        const _name = name.replace(/index$/, "");
        let root = `.`
        const jsonPath = `${root}/src/${name}.json`
        const json = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf-8' }));
        const comps = json.usingComponents;
        if(comps && Object.keys(comps).length) {
            const result = entryFilesIterator(comps)
            entries = {
                ...entries,
                ...result.entries
            }
            a = a.concat(result.a)
            j = j.concat(result.j)
            l = l.concat(result.l)
        }
        entries[`components/${ite}`] = `${root}/src/${name}.js`
        a.push({
            src: isLib ? `${root}/dist/${name}.axml` : `${root}/src/${name}.axml`,
            dest: path.join(destPath, _name)
        })
        j.push({
            src: isLib ? `${root}/dist/${name}.json` : `${root}/src/${name}.json`,
            dest: path.join(destPath, _name)
        })
        l.push({
            src: isLib ? `${root}/dist/${name}.acss` : `${root}/src/${name}.less`,
            dest: path.join(destPath, _name)
        })
    }
    return {
        entries,
        a,
        j,
        l
    }
}
const prodConfig = prodCompileFilter()
module.exports = {
    common: {
        srcPath: srcPath,
        destPath: destPath,
        imageSrc: "./src/assets/static/**/*.*",
        imageDest: `${destPath}/assets/static`,
        dev: {
            jsonDirs: [
                {
                    src: path.resolve(srcPath, "{app,ext}.json"),
                    dest: destPath,
                },
                {
                    src: path.resolve(srcPath, "pages/**/*.json"),
                    dest: path.join(destPath, "pages"),
                },
                {
                    src: path.resolve(srcPath, "components/**/*.json"),
                    dest: path.join(destPath, "components"),
                }
            ],
            axmlDirs: [
                {
                    src: path.resolve(srcPath, "pages/**/*.axml"),
                    dest: path.join(destPath, "pages"),
                },
                {
                    src: path.resolve(srcPath, "components/**/*.axml"),
                    dest: path.join(destPath, "components"),
                },
            ],
            lessDirs: [
                {
                    src: path.resolve(srcPath, "app.less"),
                    dest: destPath,
                },
                {
                    src: path.resolve(srcPath, "pages/**/*.less"),
                    dest: path.join(destPath, "pages"),
                },
                {
                    src: path.resolve(srcPath, "components/**/*.less"),
                    dest: path.join(destPath, "components"),
                },
                {
                    src: path.resolve(srcPath, "assets/styles/**/*.less"),
                    dest: path.join(destPath, "assets"),
                }
            ],
            jsDirs: [
                {
                    src: path.resolve(srcPath, "app.js"),
                    dest: destPath
                },
                {
                    src: path.resolve(srcPath, "pages/**/*.js"),
                    dest: path.join(destPath, "pages"),
                },
                {
                    src: path.resolve(srcPath, "components/**/*.js"),
                    dest: path.join(destPath, "components")
                }
            ]
        },
        prod: {
            jsonDirs: prodConfig.jsonDirs,
            axmlDirs: prodConfig.axmlDirs,
            lessDirs: prodConfig.lessDirs,
            jsDirs: prodConfig.jsDirs
        }
    }
}