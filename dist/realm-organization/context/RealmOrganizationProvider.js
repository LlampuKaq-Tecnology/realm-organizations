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
import { useMemo } from "react";
import { RealmOrganizationsContext } from "./RealmOrganizations";
import { useSetUserRealm, useUser, useUserRealm } from "@llampukaq/realm";
import { customAlphabet, nanoid } from "nanoid";
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
        const data = Object.assign({ created: new Date(), organizationId: nanoid(10), name: name, members: [{ role: "admin", userId: user.userId }], project_name: `${formatOrganization(name)}${customId()}` }, moreData);
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("create", {
            uId: user.userId,
        }, data));
        setOrganization(res.organization);
        setUser(res.user);
    });
    const getOrganization = (userRealm, user) => __awaiter(this, void 0, void 0, function* () {
        if (user.organizations) {
            const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("get", {
                bId: user.organizations[0].organizationId,
                uId: user.userId,
            }, false));
            setOrganization(res);
        }
    });
    const updateOrganization = (data) => __awaiter(this, void 0, void 0, function* () {
        setOrganization(yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("update", acc(organization === null || organization === void 0 ? void 0 : organization.organizationId), data)));
    });
    const addMemberOrganization = (id) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("addMember", acc(id), { user: id }));
        if (res.organization)
            setOrganization(res.organization);
    });
    const deleteMemberOrganization = (id) => __awaiter(this, void 0, void 0, function* () {
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("deleteMember", acc(id), { user: id }));
        if (res.organization)
            setOrganization(res.organization);
    });
    const addPanelOrganization = (data) => __awaiter(this, void 0, void 0, function* () {
        setOrganization(yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("addPanel", acc(organization === null || organization === void 0 ? void 0 : organization.organizationId), data)));
    });
    const deletePanelOrganization = (panel) => __awaiter(this, void 0, void 0, function* () {
        const { res } = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("deleteMember", acc(panel), false));
        setOrganization(res);
    });
    const contextValue = useMemo(() => ({
        organization,
        createOrganization,
        getOrganization,
        updateOrganization,
        addMemberOrganization,
        addPanelOrganization,
        deleteMemberOrganization,
        deletePanelOrganization,
    }), [organization]);
    return (_jsx(RealmOrganizationsContext.Provider, { value: contextValue, children: children }));
}
export default RealmOrganizationsProvider;
