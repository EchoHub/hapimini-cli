import CONSTANTS from "_constants/index"
import Utils from "/utils/utils"
const customEvent = new Utils.EventTarget()
App({
    /**
     * APP全局常量挂载
     */
    CONSTANTS: {
        ...CONSTANTS
    },
    /**
     * 自定义事件，（状态管理、事件通知）
     */
    $event: customEvent,
    onLaunch(options) {
        console.log(options)
    },
    onShow(options) {
        console.log(options)
    },
    onHide() {
    },
    onError(err) {
    },
    onShareAppMessage() {
    },
    globalData: {}
})