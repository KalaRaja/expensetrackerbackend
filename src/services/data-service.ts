import { Connection } from '../database/connection';
import { Column, UserColumn, Table } from '../enums/table-description';
import { Logger } from '../logger';
import { User } from '../types/user';
import { QueryBuilder } from './query-builder';

export class DataService {
    private readonly databaseConnection: Connection;

    constructor(connection: Connection) {
        this.databaseConnection = connection;
    }

    createUser(user: User) {
        const structure = {
            table: Table.USER,
            columns: [UserColumn.ID, UserColumn.USERNAME, UserColumn.FIRST_NAME, UserColumn.LAST_NAME, UserColumn.EMAIL, UserColumn.PASSWORD],
            values: [user.id, user.username, user.firstname?? null, user.lastname, user.email, user.password]
        };
        const queryStatement = QueryBuilder.buildInsertStatement(structure);
        const connection = this.databaseConnection.getConnection();
        connection.query(queryStatement);
    }

    /*getActivities(id: string[]): Activity[] {
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
    }*/
}