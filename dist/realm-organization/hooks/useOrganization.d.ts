export declare function useOrganization<T>(): {
    organization: T | undefined;
    getOrganization: (id: string) => Promise<void>;
    createOrganization: (name: string, moreData?: object) => Promise<void>;
    updateOrganization: (data: object) => Promise<void>;
    addMemberOrganization: (id: string) => Promise<void>;
    deleteMemberOrganization: (id: string) => Promise<void>;
    addPanelOrganization: (data: any) => Promise<void>;
    deletePanelOrganization: (panel: string) => Promise<void>;
};
