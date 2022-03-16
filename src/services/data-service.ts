import { RowDataPacket } from 'mysql2';
import Query from 'mysql2/typings/mysql/lib/protocol/sequences/Query';
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
        this.performTransaction([queryStatement]);
    }

    /*public getActivities(id: string[]): Activity[] {
        const connection = this.databaseConnection.getConnection();
        connection.query(queryStatement, (err, result) => {
            Logger.error('Error in query', err);
            Logger.info('result', result);
        });
        return [];
    }*/

    public createExpense() {

    }

    private performTransaction(querySequence: string[]) {
        const connection = this.databaseConnection.getConnection();

        connection.beginTransaction((error: Error) => {
            if (error) {
                connection.rollback(() => {
                    Logger.error("could not complete transaction", error);
                });
            connection.destroy();
            }

            querySequence.forEach(sql => {
                Logger.info('Query to be executed under transaction: ', sql);
                connection.query({
                        sql,
                        timeout: 2000
                    },      
                    (error: Query.QueryError, result: RowDataPacket[]) => {
                    if (error) {
                        Logger.error('Error in query', error);
                        connection.rollback(() => Logger.error("Could not complete transaction", error));
                        connection.destroy();
                    }
                });
            });

            connection.commit((error: Error) => {
                if (error) {
                    connection.rollback(() => Logger.error("could not complete transaction", error));
                    connection.destroy();
                }
                Logger.info('Transaction success');
            });
        });
    }
}