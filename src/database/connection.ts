import { ConnectionOptions, Connection as MysqlConnection, createConnection } from 'mysql2';
import { Logger } from '../logger';

export class Connection {
    private readonly mysqlConnection: MysqlConnection;

    constructor(config: ConnectionOptions) {
        this.mysqlConnection = createConnection(config);
        this.mysqlConnection.on('error', error => {
            Logger.error('Error on Database.', error)
        });
    }

    public getConnection(): MysqlConnection {
        this.mysqlConnection.connect();
        return this.mysqlConnection;
    }

    public closeConnection() {
        this.mysqlConnection.destroy();
    }
}