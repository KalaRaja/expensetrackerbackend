import { Connection as MysqlConnection, ConnectionOptions, createConnection } from 'mysql2';
import { Logger } from '../logger';

export class Connection {
    private mysqlConnection: MysqlConnection;
    private readonly connectionOptions: ConnectionOptions;

    constructor(config: ConnectionOptions) {
        this.connectionOptions = config;
    }

    public getConnection(): MysqlConnection {
        Logger.info('Connecting to Database.');
        this.mysqlConnection = createConnection(this.connectionOptions);
        this.mysqlConnection.on('error', (error: Error) => {
            Logger.error('Error on Database.', error);
        });

        this.mysqlConnection.connect();
        return this.mysqlConnection;
    }

    public closeConnection() {
        Logger.info('Closing Database connection.');
        this.mysqlConnection.destroy();
    }
}