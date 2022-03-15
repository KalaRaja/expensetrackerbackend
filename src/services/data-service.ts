import { Connection } from '../database/connection';
import { UserColumns, Tables } from '../enums/table-description';
import { Logger } from '../logger';
import { Activity } from '../types/activity';
import { User } from '../types/user';
import { QueryBuilder } from './query-builder';

export class DataService {
    private readonly databaseConnection: Connection;

    constructor(connection: Connection) {
        this.databaseConnection = connection;
    }

    public createUser(user: User) {
        const structure = {
            table: Tables.USER,
            columns: [UserColumns.ID, UserColumns.USERNAME, UserColumns.FIRST_NAME, UserColumns.LAST_NAME, UserColumns.EMAIL, UserColumns.PASSWORD],
            values: [user.id, user.username, user.firstname?? null, user.lastname, user.email, user.password]
        };
        const queryStatement = QueryBuilder.buildInsertStatement(structure);
        const connection = this.databaseConnection.getConnection();
        connection.query(queryStatement);
        connection.destroy();
    }

    /*public getActivities(id: string[]): Activity[] {
        const connection = this.databaseConnection.getConnection();
        const structure = {

        }
    }*/

    public getActivities(id: string[]): Activity[] {
        const connection = this.databaseConnection.getConnection();

        const queryStatement = QueryBuilder.buildSelectStatment(
            {
                columns: [
                    {
                        name: UserColumns.ID,
                        fromAlias: 'u',
                        toAlias: 'iden'
                    },
                    {
                        name: UserColumns.EMAIL,
                        fromAlias: 'u',
                        toAlias: 'em'
                    },
                    {
                        name: UserColumns.FIRST_NAME,
                        fromAlias: 'c',
                        toAlias: 'cname'
                    }
                ],
                joins: {
                    next: {
                        table: {
                            name: Tables.EXPENSE,
                            alias: 'tableb'
                        },
                        joinOnfield: 'id',
                        operator: '<'
                    },
                    table: {
                        name: Tables.USER,
                        alias: 'tableA'
                    },
                    operator: '=',
                    joinOnfield: 'id',
                }
                /*tables: [
                    {
                        table: Tables.USER,
                        alias: 'u'
                    },
                    {
                        table: Tables.CATEGORY,
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
                }*/
            }
        );

        Logger.info(queryStatement);

        connection.query(queryStatement, err => Logger.error('Error in query', err), result => Logger.info(JSON.stringify(result)));
        return [];
    }
}