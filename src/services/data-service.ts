import moment from 'moment';
import { RowDataPacket } from 'mysql2';
import Query from 'mysql2/typings/mysql/lib/protocol/sequences/Query';
import { v4 as uuid } from 'uuid';
import { Connection } from '../database/connection';
import { Statuses } from '../enums/statuses';
import { ActivityColumns, ExpenseColumns, ExpenseHistoryColumns, Tables, UserColumns } from '../enums/table-description';
import { Logger } from '../logger';
import { Expense } from '../types/db-entities/expense';
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

    public createExpense(expense: Expense) {
        const expenseInsertStructure = {
            table: Tables.EXPENSE,
            columns: [ExpenseColumns.ID,ExpenseColumns.TITLE, ExpenseColumns.COST, ExpenseColumns.DATE, ExpenseColumns.DESCRIPTION, ExpenseColumns.BY_USER_ID, ExpenseColumns.FOR_USER_ID, ExpenseColumns.CATEGORY_ID],
            values: [expense.id, expense.title, expense.cost, expense.date, expense.description, expense.byUserId, expense.forUserId, expense.categoryId]
        };

        const expensehistoryInsertStructure = {
            table: Tables.EXPENSE_HISTORY,
            columns: [ExpenseHistoryColumns.ID, ExpenseHistoryColumns.NEW_ID, ExpenseHistoryColumns.STATUS],
            values: [uuid(), expense.id, Statuses.NEW]
        };

        const activityInsertStructure = {
            table: Tables.ACTIVITY,
            columns: [ActivityColumns.ID, ActivityColumns.EXPENSE_HISTORY_ID, ActivityColumns.BY_USER_ID, ActivityColumns.DATE],
            values: [uuid(), expensehistoryInsertStructure.values[0], expense.byUserId, expense.date]
        };

        this.performTransaction([QueryBuilder.buildInsertStatement(expenseInsertStructure),
            QueryBuilder.buildInsertStatement(expensehistoryInsertStructure), QueryBuilder.buildInsertStatement(activityInsertStructure)]);
    }

    public deleteExpense(expenseId: string, userId: string) {
        const expenseHistoryInsertStructure = {
            table: Tables.EXPENSE_HISTORY,
            columns: [ExpenseHistoryColumns.ID, ExpenseHistoryColumns.OLD_ID, ExpenseHistoryColumns.STATUS],
            values: [uuid(), expenseId, Statuses.DELETED]
        };

        const activityInsertStructure = {
            table: Tables.ACTIVITY,
            columns: [ActivityColumns.ID, ActivityColumns.DATE, ActivityColumns.BY_USER_ID, ActivityColumns.EXPENSE_HISTORY_ID],
            values: [uuid(), moment().format('YYYY-MM-DD hh:mm:ss'), userId, expenseHistoryInsertStructure.values[0]]
        };

        this.performTransaction([QueryBuilder.buildInsertStatement(expenseHistoryInsertStructure),
            QueryBuilder.buildInsertStatement(activityInsertStructure)
        ]);
    }


    private performTransaction(querySequence: string[]) {
        const connection = this.databaseConnection.getConnection();

        connection.beginTransaction((error: Error) => {
            if (error) {
                connection.rollback(() => {
                    Logger.error("could not begin transaction", error);
                });
            connection.destroy();
            return;
            }

            querySequence.forEach(sql => {
                Logger.info('Query to be executed under transaction: ', sql);
                connection.query({
                        sql,
                        timeout: 2000
                    },
                    (queryError: Query.QueryError, result: RowDataPacket[]) => {
                    if (error) {
                        Logger.error('Error in query', queryError);
                        connection.rollback(() => Logger.error("Could not complete transaction", queryError));
                        connection.destroy();
                        return;
                    }
                });
            });

            connection.commit((commitError: Error) => {
                if (error) {
                    connection.rollback(() => Logger.error("could not complete transaction", commitError));
                    connection.destroy();
                    return;
                }
                Logger.info('Transaction success');
            });
        });
    }
}