import express from 'express';
import { Connection } from './database/connection';
import { Method } from './enums/method';
import { Routes } from './routes/routes';
import dotenv from 'dotenv';

class App {
    private readonly app = express();
    private readonly service: any;
    private readonly routes: Routes;
    private readonly connection: Connection;
    private readonly port: number = 3000;

    constructor(port: number) {
        this.routes = new Routes(undefined);

        this.connection = new Connection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            port: Number(process.env.DATABASE_PORT ?? 3306)
        });

        this.initApp();
    }

    private initApp() {
        dotenv.config();
        this.setRoutes();
        this.connection.getConnection();
        this.start();
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
        console.log(`Listening on ${this.port}`)
        this.app.listen(this.port);
    }
}

new App(3000);