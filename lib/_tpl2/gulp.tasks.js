const gulp = require('gulp')
const gulpif = require('gulp-if')
const minimist = require('minimist')
const rename = require('gulp-rename')
const pump = require('pump')
const rimraf = require('rimraf')
const logger = require('./logger')
const less = require('gulp-less')
const LessAutoprefix = require('less-plugin-autoprefix')
const autoprefix = new LessAutoprefix({ browsers: ['> 1%'] })
const cleanCss = require('gulp-clean-css')

const babel = require('gulp-babel')

const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const imageminJpegtran = require('imagemin-jpegtran')

const jsonmin = require('gulp-jsonmin')
    ; require('colors')
const knownOptions = {
    default: { env: process.env.NODE_ENV || 'development' }
}
const env = process.env.NODE_ENV;
// 当前编译模式

async function clean() {
    rimraf.sync(env === "development" ? "./dev": "./dist")
    logger.warn(`${env === "development" ? "dev" : "dist"}文件夹清空完成!!!，开始编译....`.green)
}
async function lessCompile() {
    const glob = require('./default')
    const { dev, prod } = glob.common
    const lessDirs = (env === "development" ? dev : prod).lessDirs
    try {
        return lessDirs.map((dir, index) => {
            return pump([
                gulp.src(dir.src),
                gulpif(/\.less$/.test(dir.src), less({
                    plugins: [autoprefix]
                })),
                gulpif(env === 'production', cleanCss()),
                rename({
                    extname: '.acss'
                }),
                gulp.dest(dir.dest)
            ], () => {
                logger.info(`(${index + 1}/${lessDirs.length}) ${dir.src} 编译完成`.green)
            })
        })
    } catch (err) {
        logger.error(err)
    }
}
async function axmlCompile() {
    const glob = require('./default')
    const { dev, prod } = glob.common
    const axmlDirs = (env === "development" ? dev : prod).axmlDirs
    try {
        axmlDirs.map((dir, index) => {
            return pump([
                gulp.src(dir.src),
                rename({
                    extname: '.axml'
                }),
                gulp.dest(dir.dest)
            ], (err) => {
                logger.info(`(${index + 1}/${axmlDirs.length}) ${dir.src} 编译完成`.green)
            })
        })
    } catch (err) {
        logger.error(err)
    }
}
async function jsonCompile() {
    const glob = require('./default')
    const { dev, prod } = glob.common
    const jsonDirs = (env === "development" ? dev : prod).jsonDirs
    try {
        jsonDirs.map((dir, index) => {
            return pump([
                gulp.src(dir.src),
                gulpif(env === 'production', jsonmin()),
                gulp.dest(dir.dest)
            ], () => {
                logger.info(`(${index + 1}/${jsonDirs.length}) ${dir.src} 编译完成`.green)
            })
        })
    } catch (err) {
        logger.error(err)
    }
}
async function jsCompile() {
    const glob = require('./default')
    const { dev, prod } = glob.common
    const jsDirs = (env === "development" ? dev : prod).jsDirs
    try {
        jsDirs.map((dir, index) => {
            return pump([
                gulp.src(dir.src),
                babel(),
                gulp.dest(dir.dest)
            ], (err) => {
                if (err) logger.error(err)
                else
                    logger.info(`(${index + 1}/${jsDirs.length}) ${dir.src} 编译完成`.green)
            })
        })
    } catch (err) {
        logger.error(err)
    }
}
async function assetsCompile() {
    const glob = require('./default')
    const { imageSrc, imageDest } = glob.common
    const { env } = minimist(process.argv.slice(2), knownOptions)
    try {
        rimraf.sync(imageDest)
        return pump([
            gulp.src(imageSrc),
            gulpif(env === 'production', imagemin({
                optimizationLevel: 7,
                progressive: true,
                use: [pngquant(), imageminJpegtran()]
            })),
            gulp.dest(imageDest)
        ])
    } catch (err) {
        logger.error(err)
    }
}
function getWatchConf() {
    logger.info("开始监听...".green)
    const glob = require('./default')
    const { dev, prod } = glob.common
    let lessDirs, axmlDirs, jsonDirs, jsDirs;
    if (env === "development") {
        lessDirs = dev.lessDirs
        axmlDirs = dev.axmlDirs
        jsonDirs = dev.jsonDirs
        jsDirs = dev.jsDirs
    } else {
        lessDirs = prod.lessDirs
        axmlDirs = prod.axmlDirs
        jsonDirs = prod.jsonDirs
        jsDirs = prod.jsDirs
    }
    const imSrc = glob.common.imageSrc
    const lDirs = lessDirs.map(dir => {
        return dir.src
    })
    const aDirs = axmlDirs.map(dir => {
        return dir.src
    })
    const JDirs = jsonDirs.map(dir => {
        return dir.src
    })
    const jDirs = jsDirs.map(dir => {
        return dir.src
    })
    return {
        imSrc,
        lDirs,
        aDirs,
        JDirs,
        jDirs
    }
}
module.exports = SLGulp = {
    clean,
    lessCompile,
    axmlCompile,
    jsonCompile,
    assetsCompile,
    jsCompile,
    getWatchConf,
    logger: logger
}