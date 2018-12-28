export interface IAdminAccount {
    loginName: string;
    password: string;
    fullName: string;
    adminDescription: string;
    adminGroupId: number;
}

export interface IAdminGroupsDTOList {
    adminGroupId: number;
    adminGroupName: string;
    createTime: string;
    lastUpdateTime: string;
    isActive: boolean;
    deleteTime: string;
    privileges: string;
}

export interface DialogData {
    animal: string;
    name: string;
}
