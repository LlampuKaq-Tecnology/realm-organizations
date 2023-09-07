export const formatOrganization = (text) => {
    const res = text === null || text === void 0 ? void 0 : text.replace(/ /g, "").toLowerCase();
    return res === null || res === void 0 ? void 0 : res.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
