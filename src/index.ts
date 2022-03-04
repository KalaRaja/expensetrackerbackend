import express from 'express';
import * as core from 'express-serve-static-core';
import { Method } from './enums/method';
import { Routes } from './routes/route';

class App {
    app = express();
    service: any;

    setRoutes() {
        //const service
        const routes = new Routes(undefined).getRoutes();

        routes.forEach(route => {
            switch(route.method) {
                case Method.GET: this.app.get(route.path, route.handler); break;
                case Method.POST: this.app.post(route.path, route.handler); break;
                case Method.PATCH: this.app.patch(route.path, route.handler); break;
                case Method.DELETE: this.app.delete(route.path, route.handler); break;
            }
        })
    }

    start(port: number) {
        console.log(`Listening on ${port}`)
        this.app.listen(port);
    }
}

const app = new App();
app.setRoutes();
app.start(3000);