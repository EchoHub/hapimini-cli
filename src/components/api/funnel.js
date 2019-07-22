
import CONSTANTS from "/components/_constants/index"
import apiFuncTemplateFactory from "/components/api/_api_"
        
export function create(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/funnel/create",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function delete_1(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/funnel/delete",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function update(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/funnel/update",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function detail(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/funnel/detail",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function list(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/funnel/list",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}
