import { Connection } from "../database/connection";
import { Logger } from "../logger";
import { Activity } from "../types/expense";
import { SelectStatement } from "../types/query-structure";

export class DataService {
    private readonly databaseConnection: Connection;

    constructor(private connection: Connection) {
        this.databaseConnection = connection;
    }

    private buildStatment(selectStatementStructure: SelectStatement): string {
       const columns = selectStatementStructure.columns.map(c => `${c.fromAlias}.${c.column} as ${c.toAlias}`).join(',');
       const from = selectStatementStructure.tables.map(t => `${t.table}${t.alias ? ' ' + t.alias : ''}`).join(',');
       const conditions = selectStatementStructure.where?.conditions.map(c => `${c.column.fromAlias}.${c.column.column} ${c.operator} ${c.value}`) ?? [];

       // join conditions with conjunctions to form where condition string
       const whereCondition = conditions.reduce((acc, curr, i) => {
           let whereCondition$ = '';
           const conjunction = selectStatementStructure.where?.conjunction[i];
           if (conjunction) {
                whereCondition$ =  `${curr} ${conjunction} `;
           } else {
            whereCondition$ = curr;
           }
           return acc + whereCondition$;
       }, '');

       const groupBy = selectStatementStructure.groupBy?.map(g => `${g.fromAlias}.${g.column}`).join(',');
       const orderBy = `${selectStatementStructure?.orderBy?.columns?.map(o => `${o.fromAlias}.${o.column}`).join(',')} ${selectStatementStructure.orderBy?.order ?? ''}`;

       let statement = `SELECT ${columns} FROM ${from}`;
       statement = statement + (whereCondition ? ` WHERE ${whereCondition}` : '');
       statement = statement + (groupBy ? ` GROUP BY ${groupBy}` : '');
       statement = statement + (orderBy ? ` ORDER BY ${orderBy}` : '');

       return statement;
    }

    getActivities(id: string[]): Activity[] {
        const connection = this.databaseConnection.getConnection();

        const queryStatement = this.buildStatment(
            {
                columns: [
                    {
                        column: 'id',
                        fromAlias: 'u',
                        toAlias: 'iden'
                    },
                    {
                        column: 'email',
                        fromAlias: 'u',
                        toAlias: 'em'
                    }
                ],
                tables: [
                    {
                        table: 'user',
                        alias: 'u'
                    }
                ],
                where: {
                    conjunction: ['and'],
                    conditions: [
                        {
                            column: {
                                column: 'id',
                                fromAlias: 'u'
                            },
                            operator: 'IS NOT',
                            value: 'NULL'
                        },
                        {
                            column: {
                                column: 'email',
                                fromAlias: 'u'
                            },
                            operator: 'IS NOT',
                            value: 'NULL'
                        }
                    ]
                },
                orderBy: {
                    order: 'asc',
                    columns: [
                        {
                            column: 'id',
                            fromAlias: 'u'
                        }
                    ]
                }
            }
        );

        Logger.info(queryStatement);

        connection.query(queryStatement, err => Logger.error('Error in query', err), result => Logger.info(JSON.stringify(result)));
        return [];
    }
}