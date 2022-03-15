import { Columns, Tables } from "../enums/table-description";

type OperatorType = '<' | '>' | '=' | '<=' | '>=' | 'IS' | 'IS NOT' | '<>';

export interface Field {
    name: string;
    fromAlias: string;
}

export interface TableWithAlias {
    name: Tables;
    alias?: string;
}

export interface ColumnWithTableAlias {
    name: Columns;
    fromAlias?: string;
    toAlias?: string;
}

export interface OrderBy {
    fields: Field[];
    order?: 'asc' | 'desc';
}

export interface Condition {
    field: Field;
    operator: OperatorType;
    value: string | number | 'NULL';
}

export interface Wherecondition {
    conditions: Condition[];
    conjunction?: ('and' | 'or')[]; // one conjunction inserted between two conditions
}

export interface Join {
    next?: Join;
    table: TableWithAlias;
    joinOnfield?: string;
    operator?: OperatorType;
}

export interface SelectStatement {
    tables?: TableWithAlias[];
    joins?: Join;
    columns: ColumnWithTableAlias[];
    orderBy?: OrderBy;
    groupBy?: Field[];
    where?: Wherecondition;
}

export interface InsertStatement {
    table: Tables;
    columns: Columns[];
    values: (string | number)[];
}