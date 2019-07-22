module.exports = function buildApiCommonFunc(conf) {
    const {
        funcName,
        path,
        options,
        mock,
        mockData,
        hasImportConst
    } = conf
    const importContent = hasImportConst ?
        `
import CONSTANTS from "/components/_constants/index"
import apiFuncTemplateFactory from "/components/api/_api_"
        `
        : ""
    return `${importContent}
export function ${funcName === 'delete' ? 'delete_1' : funcName}(query, success, fail, complete, headers, others) {
    const conf = {
        path: "${path}",
        options: ${JSON.stringify(options)},
        mock: ${mock ? "true": "false"},
        mockData: ${mockData ? `${JSON.stringify(mockData)}` : "{}"},
        query, success, fail, complete, headers, others, CONSTANTS
    }
    apiFuncTemplateFactory(conf)
}
`;
}