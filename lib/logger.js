const log4js = require('log4js')
log4js.configure({
    appenders: {
        HapiUtilLog: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['HapiUtilLog'],
            level: log4js.levels.ALL
        },
        HapiUtilLog: {
            appenders: ['HapiUtilLog'],
            level: log4js.levels.ALL
        }
    }
});
module.exports = log4js.getLogger('HapiUtilLog')