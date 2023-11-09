var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { RealmOrganizationsContext } from "./RealmOrganizations";
import { useSetUserRealm, useUser, useUserRealm, } from "@llampukaq/realm";
import { customAlphabet } from "nanoid";
import { useCache } from "react-cache-state";
import { formatOrganization } from "../services";
function RealmOrganizationsProvider({ children }) {
    const { userRealm } = useUserRealm();
    const { setUser } = useSetUserRealm();
    const { user } = useUser();
    const [organization, setOrganization] = useCache("organization");
    const customId = customAlphabet("1234567890abcdefghijklmnopqrstuvbzx", 15);
    const acc = (id) => ({
        bId: organization === null || organization === void 0 ? void 0 : organization.organizationId,
        uId: user === null || user === void 0 ? void 0 : user.userId,
        id,
    });
    const createOrganization = (name, moreData) => __awaiter(this, void 0, void 0, function* () {
        const data = Object.assign({ created: new Date(), organizationId: customId(), name, members: [{ role: "admin", userId: user.userId }], project_name: `${formatOrganization(name)}${customId()}` }, moreData);
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("create", {
            uId: user.userId,
        }, data));
        if (res != undefined) {
            setOrganization(res.organization);
            setUser(res.user);
            return res.organization;
        }
    });
    const getOrganization = (id) => __awaiter(this, void 0, void 0, function* () {
        if (id != undefined) {
            const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("get", {
                bId: id,
                uId: user.userId,
            }, false));
            if (res != undefined)
                setOrganization(res);
        }
    });
    const updateOrganization = (data) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("update", acc(organization === null || organization === void 0 ? void 0 : organization.organizationId), data));
        if (res != undefined)
            setOrganization(res);
    });
    const addMemberOrganization = (id) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("addMember", acc(id), { user: id }));
        if (res != undefined)
            setOrganization(res.organization);
    });
    const deleteMemberOrganization = (id) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("deleteMember", acc(id), { user: id }));
        if (res != undefined)
            setOrganization(res.organization);
    });
    const addPanelOrganization = (data) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("addPanel", acc(organization === null || organization === void 0 ? void 0 : organization.organizationId), data));
        if (res != undefined)
            setOrganization(res);
    });
    const deletePanelOrganization = (panel) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("deleteMember", acc(panel), false));
        if (res != undefined)
            setOrganization(res);
    });
    const contextValue = {
        organization,
        createOrganization,
        getOrganization,
        updateOrganization,
        addMemberOrganization,
        addPanelOrganization,
        deleteMemberOrganization,
        deletePanelOrganization,
    };
    return (_jsx(RealmOrganizationsContext.Provider, { value: contextValue, children: children }));
}
export default RealmOrganizationsProvider;
