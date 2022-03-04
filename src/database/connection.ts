import { ConnectionConfig, Connection as MysqlConnection, createConnection } from 'mysql';
import { Logger } from '../logger';

export class Connection {
    private readonly mysqlConnection: MysqlConnection;

    constructor(config: ConnectionConfig) {
        this.mysqlConnection = createConnection(config);
        this.mysqlConnection.on('error', error => {
            Logger.error('Error on Database.', error)
        });
    }

    public getConnection(): Promise<Connection> {
        return new Promise((resolve, reject) => {
            this.mysqlConnection.connect();
        });
    }

    public closeConnection() {
        this.mysqlConnection.destroy();
    }
}