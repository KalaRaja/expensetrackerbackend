import { ColumnWithTableAlias, Condition, Field, InsertStatement, Join, OrderBy, SelectStatement, TableWithAlias, Wherecondition } from "../types/query-structure";
import { zip as loZip } from 'lodash';
import { Logger } from "../logger";

export class QueryBuilder {
    public static buildSelectStatment(selectStatementStructure: SelectStatement): string {
        const columns = this.buildColumnsToSelect(selectStatementStructure.columns);
        let from: string;

        if (selectStatementStructure.tables) {
            from = this.buildTablesToSelectFrom(selectStatementStructure.tables);
        } else if (selectStatementStructure.joins) {
            from = this.buildJoinsToSelectFrom(selectStatementStructure.joins);
        } else {
            Logger.error("Query should have either tables or joins to select from");
            console.log('a')
            return;
        }
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

            return `${previousString}${tableWithAliasObject.name}${alias}`;
        }, '');
    }

    private static buildJoinsToSelectFrom(join: Join): string {
        let result = '';
        let current = join;
        while(current) {
            const next = current.next;
            if (next) {
                const currentAlias = current.table.alias ? ` ${current.table.alias}` : '';
                const nextAlias = next.table.alias ? ` ${next.table.alias}` : '';
                const currentFieldAlias = current.table.alias ? `${current.table.alias}.` : '';
                const nextFieldAlias = next.table.alias ? `${next.table.alias}.` : '';
                const on = `ON ${currentFieldAlias}${current.joinOnfield} ${current.operator} ${nextFieldAlias}${next.joinOnfield}`;
                result = result ? `${result} JOIN ${next.table.name}${nextAlias}` : `${current.table.name}${currentAlias} JOIN ${next.table.name}${nextAlias}`;
                result = `${result} ${on}`;
            }
            current = next;
        }

        return result;
    }

    private static buildGroupBy(groupBy: Field[]): string {
        return (groupBy ?? []).reduce((accumulator: string, groupByObject: Field) => {
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
        const result = `${(orderBy?.fields ?? []).reduce((accumulator: string, orderByObject: Field)=> {
            const field = orderByObject.name;
            const fromAlias = orderByObject.fromAlias;
            const previousString = accumulator ? `${accumulator}, ` : '';

            if (fromAlias) {
                return `${previousString}${fromAlias}.${field}`;
            }
            return `${previousString}${field}`;
        }, '')}`;

        return result ? `${result} ${orderBy?.order ?? ''}` : result;
    }

    public static buildInsertStatement(insertStatementStructure: InsertStatement): string {
        const { table, columns, values } = insertStatementStructure;
        return `INSERT INTO ${table} (${columns.join(',')}) values (${values.map(v => typeof v === 'string' ? `'${v}'` : v).join(',')})`;
    }
}