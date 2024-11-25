import { addDays } from 'date-fns';
import { Task } from '../model/task';
import { Priority } from '../model/priority';
import database from '../util/database';
import { ca } from 'date-fns/locale';

// const allTasks = [
//     new Task({
//         id: 1,
//         description: 'shopping',
//         sidenote: 'need to do shopping for food.',
//         startDate: new Date(),
//         endDate: null,
//         deadline: addDays(new Date(), 1),
//         done: false,
//         priority: new Priority({ levelName: 'basic', colour: 'success' }),
//         userId: 1,
//     }),
//     new Task({
//         id: 2,
//         description: 'uploading paper',
//         sidenote: 'uploading a paper for a certain course',
//         startDate: new Date(),
//         endDate: null,
//         deadline: addDays(new Date(), 4),
//         done: false,
//         priority: new Priority({ levelName: 'basic', colour: 'success' }),
//         userId: 2,
//     }),
// ];

const getAllTasks = async (): Promise<Task[]> => {
    try {
        const tasksPrisma = await database.task.findMany();
        return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
    }
    catch (error) {
        console.error(error);
        throw new Error(`Database error: see server log for details.`);
    }
};

const getActiveTasks = (): Task[] => {
   const activeTasks = allTasks.filter((task) => task.getDone() === false);
   return activeTasks;
}

const getTaskById = (id: number): Task => {
    const result = allTasks.find((task) => task.getId() === id) || null;
    if (!result) {
        throw new Error(`No Task found with id ${id}.`);
    }
    return result;
};
const getTaskByPriority = (levelName: string): Task[] => {
    const result = allTasks.filter((task) => task.getPriority().getLevelName() === levelName);
    return result;
}


const deleteTask = (task: Task): void => {
    const index = allTasks.indexOf(task);
    allTasks.splice(index, 1);
};

export default {
    getAllTasks,
    getTaskById,
    deleteTask,
    getActiveTasks,
    getTaskByPriority
};
