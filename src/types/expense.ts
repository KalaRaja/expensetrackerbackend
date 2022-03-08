import moment from 'moment';

interface Category {
    id: string;
    name: string;
}

export interface Expense {
    id: string;
    byUserId: string;
    forUserId: string;
    name: string;
    category: Category;
    cost: number;
    date: moment.Moment;
}