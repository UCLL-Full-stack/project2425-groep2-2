import { UnauthorizedError } from 'express-jwt';
import { Priority } from '../model/priority';
import { Task } from '../model/task';
import priorityDb from '../repository/priority.db';
import taskDb from '../repository/task.db';
import userDb from '../repository/user.db';
import { TaskInput } from '../types';

const getAllTasks = async (): Promise<Task[]>=> await taskDb.getAllTasks();

const getActiveTasks = async (): Promise<Task[]>  => {
  return await taskDb.getActiveTasks();
}

const getTasks = async ({username,role}:any) : Promise<Task[]> =>  {
    if (role === "admin") {
        return taskDb.getActiveTasks();
    } else if (role === "user" || role === "guest") {
        const user = await userDb.getUserByUserName(username);
        if (!user) {
            throw new Error(`no User found with username: ${username}.`)
        }
        return await taskDb.getActiveTasksByUser(user);
    } else {
        throw new UnauthorizedError('credentials_required', {message: 'you are not authorized to access this resource.',});
    }
} 

const createTask = async ({
    description,
    sidenote,
    deadline,
    priority: priorityInput,
    user: userInput,
}: TaskInput, {username,role}:any): Promise<Task> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`User not found with given username: ${username}.`);
    }

    if (role === "guest") {
        throw new UnauthorizedError('credentials_required', {message: 'you are not authorized to access this resource.',});
    } else {
        const priority = new Priority(priorityInput);
        const startDate = new Date();
        const task = new Task({
            id,
            description,
            sidenote,
            startDate,
            endDate: null,
            done: false,
            deadline,
            priority,
            user,
        });
        return taskDb.createTask(task);
    }
   

};

const getTasksByPriority = async(levelName: string, {username,role}:any): Promise<Task[]> => {
    const priority = await priorityDb.getPriorityByName({levelName});
    if (!priority) {
        throw new Error(`No Priority found with levelName: ${levelName}.`)
    }
    if (role === "guest") {
        throw new UnauthorizedError('credentials_required', {message: 'you are not authorized to access this resource.',});
    } else {
        return taskDb.getTasksByPriority(levelName);
    }
}

export default { getAllTasks, getActiveTasks, createTask, getTasksByPriority , getTasks};
