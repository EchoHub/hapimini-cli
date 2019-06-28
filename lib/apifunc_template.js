module.exports = function apiFuncTemplateFactory (funcName, path, options, mock, mockData) {
    return `export function ${funcName === 'delete' ? 'delete_1' : funcName}(query, success, fail, complete, headers, others) {
    const app = getApp();
    let config = Object.assign({}, ${JSON.stringify(options)},{ 
        url: CONSTANTS.domain + "${path}",
        headers: Object.assign({}, ${JSON.stringify(options.headers)}, headers || {})})
    if (query.token) { config.headers.token = query.token }

    delete query.token
    let _query = query;

    config.headers["content-type"] = config.headers["Content-Type"]
    if(config.headers["content-type"] === "application/json" ) {
    _query = JSON.stringify(_query)
    }

    delete config.headers["Content-Type"]

    const _others = Object.assign({timeout: 3000}, others);
    const options = Object.assign({}, config, {data: _query}, _others, {
        success: resp => {
        const data = resp.data || {}
        if (data.code == '0') {
            success && success(data.data, data)
        } else if (data.code == '1002') {
            // token失效 重新获取鉴权 重新调用数据
            app.checkAuth('auth_base').then(({ token = '', user={} }) => {
            // 数据更新
            app.CONSTANTS.token = token;
            app.CONSTANTS.userInfo = user;

            my.request(Object.assign({}, config, { data: query }, _others,
            {
                success: responese => {
                const data_ = responese.data || {}
                success(data_.data, data_)
                },
                fail: fail || function(err){
                    let msg = err.msg;
                    if(typeof err === "number") {
                        msg = {
                            11: "无权跨域",
                            12: "网络出错",
                            13: "超时",
                            14: "解码失败",
                            19: "HTTP错误",
                            20: "请求已被停止/服务端限流"
                        }[err]
                    }
                    my.showToast({
                        type: 'fail',
                        content: msg || '系统异常,请稍后再试'
                    })
                },
                complete: complete
            }
            ))
            }).catch(() => {
            my.showToast({ content: '系统异常' })
            })
        } else {
            fail(data, resp)
        }
        },
        fail: fail || function(err, resp){
            let msg = err.msg;
            if(typeof err === "number") {
                msg = {
                    11: "无权跨域",
                    12: "网络出错",
                    13: "超时",
                    14: "解码失败",
                    19: "HTTP错误",
                    20: "请求已被停止/服务端限流"
                }[err]
            }
            my.showToast({
                type: 'fail',
                content: msg || '系统异常,请稍后再试'
            })
        },
        complete: complete,
    })
    return ${!mock} ? (my.httpRequest || my.request)(options) : success(JSON.parse(${JSON.stringify(mockData || {})}))
}\n`
}