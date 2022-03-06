
type OperatorType = '<' | '>' | '=' | '<=' | '>=' | 'IS' | 'IS NOT' | '<>';

interface TableWithAlias {
    table: string;
    alias?: string;
}

interface ColumnFromTableAlias {
    column: string;
    fromAlias?: string;
    toAlias?: string;
}

interface OrderBy {
    columns: ColumnFromTableAlias[];
    order?: 'asc' | 'desc';
}

interface Condition {
    column: ColumnFromTableAlias;
    operator: OperatorType;
    value: string | number | 'NULL';
}

interface Wherecondition {
    conditions: Condition[];
    conjunction?: ('and' | 'or')[]; // one conjunction inserted between two conditions
}

export interface SelectStatement {
    tables: TableWithAlias[];
    columns: ColumnFromTableAlias[];
    orderBy?: OrderBy;
    groupBy?: ColumnFromTableAlias[]
    where?: Wherecondition
}