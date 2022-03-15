import moment from "moment";
import { Expense } from "./expense";

export interface Activity {
    id: string;
    byUserId: string;
    date: moment.Moment;
    oldExpense: Expense;
    newExpense: Expense;
}