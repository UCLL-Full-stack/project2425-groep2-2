import { Priority } from '../model/priority';
import { Task } from '../model/task';

type TaskInput = {
    id?: number;
    description?: string;
    sidenote?: string;
    deadline: Date;
    startDate?: Date;
    endDate?: Date;
    priority: PriorityInput;
    done?: boolean;
    userId?: number;
};

type PriorityInput = {
    id?: number;
    levelName?: string;
    colour?: string;
};

type UserInput = {
    id?: number;
    username?: string;
    password?: string;
    tasks?: Task[];
};

export { TaskInput, PriorityInput, UserInput };
