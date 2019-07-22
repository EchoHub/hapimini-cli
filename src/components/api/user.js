
import CONSTANTS from "/components/_constants/index"
import apiFuncTemplateFactory from "/components/api/_api_"
        
export function auth(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/user/auth",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}
