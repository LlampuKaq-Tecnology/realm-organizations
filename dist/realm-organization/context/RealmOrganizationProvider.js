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
import { useCollection, useSetUserRealm, useSync, useUser, useUserRealm, } from "@llampukaq/realm";
import { customAlphabet } from "nanoid";
import { formatOrganization } from "../services";
import { useLocalStorage } from "@uidotdev/usehooks";
function RealmOrganizationsProvider({ children, onUpdate, }) {
    const { userRealm } = useUserRealm();
    const { setUser } = useSetUserRealm();
    const { user } = useUser();
    const [organization, setOrganization] = useLocalStorage("organization");
    const customId = customAlphabet("1234567890abcdefghijklmnopqrstuvbzx", 15);
    const collection = useCollection("organization", "organizations");
    useSync(collection, ["update"], (set, documentOrg) => {
        if (documentOrg.organizationId == (organization === null || organization === void 0 ? void 0 : organization.organizationId)) {
            setOrganization(documentOrg);
        }
    });
    const userCollection = useCollection("user", "users");
    const isAdmin = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const find = (yield (collection === null || collection === void 0 ? void 0 : collection.findOne({
            organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId,
        }, { projection: { _id: false, members: true } })));
        const findUser = (yield (userCollection === null || userCollection === void 0 ? void 0 : userCollection.findOne({ userId: user === null || user === void 0 ? void 0 : user.userId }, { projection: { _id: false, userId: true } })));
        const res = (_a = find === null || find === void 0 ? void 0 : find.members) === null || _a === void 0 ? void 0 : _a.find((x) => x.userId == (findUser === null || findUser === void 0 ? void 0 : findUser.userId));
        if (res != undefined) {
            if (res.role == "admin") {
                return true;
            }
            if (res.role == "user") {
                return false;
            }
        }
        else {
            return false;
        }
    });
    const isMember = (id) => __awaiter(this, void 0, void 0, function* () {
        const find = (yield (collection === null || collection === void 0 ? void 0 : collection.findOne({
            organizationId: id !== null && id !== void 0 ? id : organization === null || organization === void 0 ? void 0 : organization.organizationId,
        }, { projection: { _id: false, members: true } })));
        const findUser = (yield (userCollection === null || userCollection === void 0 ? void 0 : userCollection.findOne({ userId: user === null || user === void 0 ? void 0 : user.userId }, { projection: { _id: false, userId: true } })));
        const res = find === null || find === void 0 ? void 0 : find.members.find((x) => x.userId == (findUser === null || findUser === void 0 ? void 0 : findUser.userId));
        if (res != undefined) {
            if (res.role == "admin" || res.role == "user") {
                return true;
            }
        }
        else {
            return false;
        }
    });
    const access = (callback) => __awaiter(this, void 0, void 0, function* () {
        const member = yield isMember();
        if (member) {
            return yield callback();
        }
        else {
            throw new Error("no tines acceso");
        }
    });
    const accessAdmin = (callback) => __awaiter(this, void 0, void 0, function* () {
        const member = yield isAdmin();
        if (member) {
            return yield callback();
        }
        else {
            throw new Error("no tines acceso");
        }
    });
    const createOrganization = (name, moreData) => __awaiter(this, void 0, void 0, function* () {
        const data = Object.assign({ created: new Date(), organizationId: customId(), name, members: [{ role: "admin", userId: user === null || user === void 0 ? void 0 : user.userId }], project_name: `${formatOrganization(name)}${customId()}` }, moreData);
        const res = yield (userRealm === null || userRealm === void 0 ? void 0 : userRealm.functions.organizationOrganizations("create", {
            uId: user === null || user === void 0 ? void 0 : user.userId,
        }, data));
        if (res != undefined) {
            setOrganization(res.organization);
            setUser(res.user);
        }
    });
    const getOrganization = (id) => __awaiter(this, void 0, void 0, function* () {
        const isMemberr = yield isMember(id);
        if (isMemberr) {
            const res = yield (collection === null || collection === void 0 ? void 0 : collection.findOne({ organizationId: id }));
            if (res != undefined)
                setOrganization(res);
        }
        else {
            throw new Error("No tienes acceso");
        }
    });
    const updateOrganization = (data) => __awaiter(this, void 0, void 0, function* () {
        yield access(() => __awaiter(this, void 0, void 0, function* () {
            const res = yield (collection === null || collection === void 0 ? void 0 : collection.findOneAndUpdate({
                organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId,
            }, { $set: data }));
            if (res != undefined) {
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(res);
                setOrganization(res);
            }
        }));
    });
    const addMemberOrganization = (user) => __awaiter(this, void 0, void 0, function* () {
        yield accessAdmin(() => __awaiter(this, void 0, void 0, function* () {
            yield (collection === null || collection === void 0 ? void 0 : collection.findOneAndUpdate({ organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId }, {
                $push: {
                    members: { userId: user === null || user === void 0 ? void 0 : user.userId, role: "user", invitation: true },
                },
            }));
            yield (userCollection === null || userCollection === void 0 ? void 0 : userCollection.findOneAndUpdate({ userId: user === null || user === void 0 ? void 0 : user.userId }, {
                $push: {
                    organizations: {
                        name: organization === null || organization === void 0 ? void 0 : organization.name,
                        organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId,
                        invitation: true,
                    },
                },
            }));
        }));
    });
    const deleteMemberOrganization = (user) => __awaiter(this, void 0, void 0, function* () {
        yield accessAdmin(() => __awaiter(this, void 0, void 0, function* () {
            yield (collection === null || collection === void 0 ? void 0 : collection.findOneAndUpdate({ organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId }, {
                $pull: {
                    members: { userId: user === null || user === void 0 ? void 0 : user.userId },
                },
            }));
            yield (userCollection === null || userCollection === void 0 ? void 0 : userCollection.findOneAndUpdate({ userId: user === null || user === void 0 ? void 0 : user.userId }, {
                $pull: {
                    organizations: {
                        organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId,
                    },
                },
            }));
        }));
    });
    const addPanelOrganization = (data) => __awaiter(this, void 0, void 0, function* () {
        yield accessAdmin(() => __awaiter(this, void 0, void 0, function* () {
            yield (collection === null || collection === void 0 ? void 0 : collection.findOneAndUpdate({ organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId }, { $push: { panels: data } }));
        }));
    });
    const deletePanelOrganization = (panel) => __awaiter(this, void 0, void 0, function* () {
        yield accessAdmin(() => __awaiter(this, void 0, void 0, function* () {
            yield (collection === null || collection === void 0 ? void 0 : collection.findOneAndUpdate({ organizationId: organization === null || organization === void 0 ? void 0 : organization.organizationId }, { $pull: { panels: { appId: panel } } }));
        }));
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
        onUpdate,
    };
    return (_jsx(RealmOrganizationsContext.Provider, { value: contextValue, children: children }));
}
export default RealmOrganizationsProvider;
