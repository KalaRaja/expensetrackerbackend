import { Connection } from "../database/connection";
import { Logger } from "../logger";
import { Activity } from "../types/expense";
import { QueryBuilder } from "./query-builder";

export class DataService {
    private readonly databaseConnection: Connection;

    constructor(private connection: Connection) {
        this.databaseConnection = connection;
    }

    getActivities(id: string[]): Activity[] {
        const connection = this.databaseConnection.getConnection();

        const queryStatement = QueryBuilder.buildStatment(
            {
                columns: [
                    {
                        name: 'id',
                        fromAlias: 'u',
                        toAlias: 'iden'
                    },
                    {
                        name: 'email',
                        fromAlias: 'u',
                        toAlias: 'em'
                    },
                    {
                        name: 'name',
                        fromAlias: 'c',
                        toAlias: 'cname'
                    }
                ],
                tables: [
                    {
                        table: 'user',
                        alias: 'u'
                    },
                    {
                        table: 'category',
                        alias: 'c'
                    }
                ],
                where: {
                    conjunction: ['and', 'and'],
                    conditions: [
                        {
                            field: {
                                name: 'id',
                                fromAlias: 'u'
                            },
                            operator: 'IS NOT',
                            value: 'NULL'
                        },
                        {
                            field: {
                                name: 'email',
                                fromAlias: 'u'
                            },
                            operator: 'IS NOT',
                            value: 'NULL'
                        },
                        {
                            field: {
                                name: 'id',
                                fromAlias: 'c'
                            },
                            operator: 'IS NOT',
                            value: 'NULL'
                        }
                    ]
                },
                orderBy: {
                    order: 'asc',
                    fields: [
                        {
                            name: 'id',
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