
import CONSTANTS from "/components/_constants/index"
import apiFuncTemplateFactory from "/components/api/_api_"
        
export function list(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/permission/list",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function delete_1(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/permission/delete",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function add(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/permission/add",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}
