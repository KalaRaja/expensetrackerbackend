import dotenv from 'dotenv';
import express from 'express';
import { Connection } from './database/connection';
import { Method } from './enums/method';
import { Logger } from './logger';
import { Routes } from './routes/routes';
import { DataService } from './services/data-service';

class App {
    private readonly app = express();
    private readonly service: any;
    private readonly routes: Routes;
    private readonly connection: Connection;
    private readonly port: number = 3000;

    constructor(port: number) {
        dotenv.config();
        this.routes = new Routes(undefined);
        this.port = port;

        this.connection = new Connection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            port: Number(process.env.DATABASE_PORT ?? 3306),
            database: process.env.DATABASE_NAME
        });

        this.initApp();
    }

    private initApp() {
        this.setRoutes();
        Logger.info('Starting App.');
        this.start();

        new DataService(this.connection).createUser({ id: 'oxa', username: 'oxa', firstname: 'oxa', lastname: 'oxa', email: 'oxa', password: 'oxa' });
        //new DataService(this.connection).getActivities([]);
    }

    setRoutes() {
        const routes = this.routes.getRoutes();

        routes.forEach(route => {
            switch(route.method) {
                case Method.GET: this.app.get(route.path, route.handler); break;
                case Method.POST: this.app.post(route.path, route.handler); break;
                case Method.PATCH: this.app.patch(route.path, route.handler); break;
                case Method.DELETE: this.app.delete(route.path, route.handler); break;
            }
        })
    }

    start() {
        this.app.listen(this.port);
        Logger.info(`Listening on ${this.port}.`);
    }
}

new App(3030);