import { Request, Response } from 'express';
import { Endpoints } from '../enums/endpoints';
import { Method } from '../enums/method';
import { Route } from '../types/route';


export class Routes {
    private service: any;
    private Routes: Array<Route> = [];

    constructor(service: any) {
        this.service = service;
    }

    public getRoutes(): Array<Route> {

        return [this.createRoute('/', Method.GET)];
    }

    private createRoute(path: string, method: Method): Route {
        const route = {
            path,
            method,
            handler: (_req: Request, res: Response) => {
                res.sendStatus(200);
            }
        }
        return route;
    }
}