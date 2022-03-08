import { Column, Table } from "../enums/table-description";

type OperatorType = '<' | '>' | '=' | '<=' | '>=' | 'IS' | 'IS NOT' | '<>';
export type FieldType = Omit<ColumnWithTableAlias, 'toAlias'>;

export interface TableWithAlias {
    table: Table;
    alias?: string;
}

export interface ColumnWithTableAlias {
    name: Column;
    fromAlias?: string;
    toAlias?: string;
}

export interface OrderBy {
    fields: FieldType[];
    order?: 'asc' | 'desc';
}

export interface Condition {
    field: FieldType;
    operator: OperatorType;
    value: string | number | 'NULL';
}

export interface Wherecondition {
    conditions: Condition[];
    conjunction?: ('and' | 'or')[]; // one conjunction inserted between two conditions
}

export interface SelectStatement {
    tables: TableWithAlias[];
    columns: ColumnWithTableAlias[];
    orderBy?: OrderBy;
    groupBy?: FieldType[];
    where?: Wherecondition;
}

export interface InsertStatement {
    table: Table;
    columns: Column[];
    values: (string | number)[];
}