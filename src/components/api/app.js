
export function update(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/update",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function create(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/create",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function delete_1(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/delete",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

import CONSTANTS from "/components/_constants/index"
import apiFuncTemplateFactory from "/components/api/_api_"
        
export function list(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/list",
        options: {"headers":{"Content-Type":"application/json"},"method":"GET","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}

export function details(query, success, fail, complete, headers, others) {
    const conf = {
        path: "/app/details",
        options: {"headers":{"Content-Type":"application/json"},"method":"POST","dataType":"json"},
        mock: false,
        mockData: {},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}
