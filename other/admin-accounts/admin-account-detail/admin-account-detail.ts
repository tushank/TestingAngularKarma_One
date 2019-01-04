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

export class AdminAccount {
    constructor(public loginName = '',
        public password = '',
        public fullName = '',
        public adminDescription = '',
        public adminGroupId = 0) { }
}

