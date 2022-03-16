import { Statuses } from "../../enums/statuses";

export interface ExpenseHistory {
    id: string;
    status: Statuses;
    oldId?: string;
    newId?: string;
}