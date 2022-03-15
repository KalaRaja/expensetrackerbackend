export enum Tables {
    USER = 'user',
    EXPENSE = 'expense',
    ACTIVITY = 'activity',
    STATUS = 'status',
    EXPENSE_HISTORY = 'expensehistory',
    CATEGORY = 'category'
}

export enum UserColumns {
    ID = 'id',
    USERNAME = 'username',
    EMAIL = 'email',
    FIRST_NAME = 'firstname',
    LAST_NAME = 'lastname',
    PASSWORD = 'password'
}

export enum ExpenseColumns {
    ID = 'id',
    TITLE = 'title',
    DESCRIPTION = 'description',
    COST = 'cost',
    DATE = 'date',
    BY_USER_ID = 'byuserid',
    FOR_USER_ID = 'foruserid'
}

export enum StatusColumns {
    ID = 'id',
    NAME = 'name',
}

export enum ExpenseHistoryColumns {
    ID = 'id',
    STATUS_ID = 'statusid',
    OLD_ID = 'oldid',
    NEW_ID = 'newid'
}

export enum CategoryColumns {
    ID = 'id',
    NAME = 'name',
    IS_PERMANENT = 'ispermanent'
}

export enum ActivityColumns {
    ID = 'id',
    EXPENSE_HISTORY_ID = 'expensehistoryid',
    BY_USER_ID = 'byuserid',
    DATE = 'date'
}

export type Columns = UserColumns | ExpenseColumns | StatusColumns | ExpenseHistoryColumns | CategoryColumns | ActivityColumns;
