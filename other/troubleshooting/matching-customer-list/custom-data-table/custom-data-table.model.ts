export interface ITableInfo {
    isPaginationEnabled: boolean;
    isRefreshTableEnabled: boolean;
    itemsPerPageInfo: IItemsPerPageInfo;
    isPerPageItemCountEnabled: boolean;
    isHorizontalScrollEnabled: boolean;
    isRowSrNumEnabled: boolean;
    currentPageNumber: number;
    totalRecords: number;
    columnInfo: Array<IColumnInfo>;
    rowsInfo: IRowInfo;
    isAsyncEventComplete: boolean;
}

export interface IColumnInfo {
    headerName: string;
    isColumnFixed: boolean;
    propertyName: string;
    columnType: ColumnType | string;
    listOfLinks: Array<string>;
    width: string;
    styles: Array<ICssStyles>;
}

export interface IRowInfo {
    rowsList: Array<any>;
}

export interface IItemsPerPageInfo {
    isEnabled: boolean;
    options: Array<number>;
    activeOption: number;
}

export interface ICssStyles {
    propertyName: string;
    propertyValue: string;
}

export enum ColumnType {
    TEXT = 'text', LINKS = 'links'
}
