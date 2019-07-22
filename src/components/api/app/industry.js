
import CONSTANTS from "/components/_constants/index"
import apiFuncTemplateFactory from "/components/api/_api_"
        
export function list(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/industry/list",
        options: {"headers":{},"method":"GET","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}
