import { Request, Response } from "express";
import { Method } from "../enums/method";

export interface Route {
    method: Method;
    path: string;
    handler: (req: Request, res: Response) => void;
}