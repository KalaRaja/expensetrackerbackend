import { ColumnWithTableAlias, Condition, FieldType, OrderBy, SelectStatement, TableWithAlias, Wherecondition } from "../types/query-structure";

export class QueryBuilder {
    public static buildStatment(selectStatementStructure: SelectStatement): string {
        const columns = this.buildColumnsToSelect(selectStatementStructure.columns);
        const from = this.buildTablesToSelectFrom(selectStatementStructure.tables);
        const whereCondition = this.buildWhereCondition(selectStatementStructure.where);
        const groupBy = this.buildGroupBy(selectStatementStructure.groupBy);
        const orderBy = this.buildOrderBy(selectStatementStructure.orderBy);

        let statement = `SELECT ${columns} FROM ${from}`;
        statement = statement + (whereCondition ? ` WHERE ${whereCondition}` : '');
        statement = statement + (groupBy ? ` GROUP BY ${groupBy}` : '');
        statement = statement + (orderBy ? ` ORDER BY ${orderBy}` : '');

        return statement;
     }

    private static buildColumnsToSelect(columns: ColumnWithTableAlias[]): string {
        return columns.reduce((accumulator: string, columnFromTableAliasObject: ColumnWithTableAlias) => {
            const fromAlias = columnFromTableAliasObject.fromAlias;
            const toAlias = columnFromTableAliasObject.toAlias;
            const previousString = accumulator ? `${accumulator}, `: '';

            if (fromAlias) {
                accumulator = `${previousString}${fromAlias}.${columnFromTableAliasObject.name}`;
            } else {
                accumulator = `${previousString}${columnFromTableAliasObject.name}`;
            }

            if (toAlias) {
                accumulator = `${accumulator} as ${toAlias}`;
            }
            return accumulator;
        }, '');
    }

    private static buildWhereCondition(whereCondition: Wherecondition): string {
        return (whereCondition?.conditions ?? []).reduce((accumulator: string, conditionObject: Condition, index: number) => {
            let conjunction: string = whereCondition.conjunction[index];

            const fromAlias = conditionObject.field.fromAlias;
            const field = conditionObject.field.name;

            const previousString = accumulator ? `${accumulator} ` : '';

            if (conjunction) {
                conjunction = ` ${conjunction}`;
            } else {
                conjunction = '';
            }

            if (fromAlias) {
                accumulator = `${previousString}${fromAlias}.${field} ${conditionObject.operator} ${conditionObject.value}`;
            } else {
                accumulator = `${previousString}${field} ${conditionObject.operator} ${conditionObject.value}`;
            }

            return `${accumulator}${conjunction}`;
        }, '');
    }

    private static buildTablesToSelectFrom(tablesWithAlias: TableWithAlias[]): string {
        return tablesWithAlias.reduce((accumulator: string, tableWithAliasObject: TableWithAlias) => {
            const alias = tableWithAliasObject.alias ? ` ${tableWithAliasObject.alias}` : '';
            const previousString = accumulator ? `${accumulator}, `: '';

            return `${previousString}${tableWithAliasObject.table}${alias}`;
        }, '');
    }

    private static buildGroupBy(groupBy: FieldType[]): string {
        return (groupBy ?? []).reduce((accumulator: string, groupByObject: FieldType) => {
            const fromAlias = groupByObject.fromAlias;
            const field = groupByObject.name;
            const previousString = accumulator ? `${accumulator}, ` : '';

            if (fromAlias) {
                return `${previousString}${fromAlias}.${field}`;
            }

            return `${previousString}${field}`;
        }, '');
    }

    private static buildOrderBy(orderBy: OrderBy): string {
        return `${(orderBy?.fields ?? []).reduce((accumulator: string, orderByObject: FieldType)=> {
            const field = orderByObject.name;
            const fromAlias = orderByObject.fromAlias;
            const previousString = accumulator ? `${accumulator}, ` : '';

            if (fromAlias) {
                return `${previousString}${fromAlias}.${field}`;
            }
            return `${previousString}${field}`;
        }, '')} ${orderBy.order ?? ''}`;
    }
}