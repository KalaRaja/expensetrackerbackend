import moment from "moment";

interface Category {
    id: string;
    name: string;
}

interface Expense {
    id: string;
    byUserId: string;
    forUserId: string;
    name: string;
    category: Category
    cost: number;
    date: moment.Moment;
}

interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string; 
}

interface Activity extends Expense{
    id: string;
    activityDate: moment.Moment;
    activityType: 'changed' | 'deleted';
    activityByUserId: string;
    notSeenByUserIds: Array<string>;
}