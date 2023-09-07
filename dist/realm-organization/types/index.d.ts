export interface Organization<T = any> {
    created: Date;
    organizationId: string;
    name: string;
    members: [{
        role: "admin" | "user";
        userId: string;
    }];
    project_name: string;
}
