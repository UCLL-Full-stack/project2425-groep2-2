import { addDays } from 'date-fns';
import { Task } from '../model/task';
import { Priority } from '../model/priority';
import database from './database';
import { User } from '../model/user';

const createTask = async (task: Task): Promise<Task> => {
    try {
        const taskPrisma = await database.task.create({
            data: {
                description: task.getDescription(),
                sidenote: task.getSidenote(),
                startDate: task.getStartDate(),
                endDate: task.getEndDate(),
                done: task.getDone(),
                deadline: task.getDeadline(),
                priority: {
                    create: {
                        levelName: task.getPriority().getLevelName(),
                        colour: task.getPriority().getColour()
                    }
                },
                user: {
                    connect: {
                        id: task.getUser().getId()
                    }
                }
            },
            include: {
                priority: true,
                user: true,
            }
        })
        return Task.from(taskPrisma);
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}

const getAllTasks = async (): Promise<Task[]> => {
    try {
        const tasksPrisma = await database.task.findMany({
            include: {
                priority: true,
                user: true,
            }
        })
        return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }   
};

const getActiveTasks = async (): Promise<Task[]> => {
   try {
         const tasksPrisma = await database.task.findMany({
              where: {
                done: false,
              },
              include: {
                priority: true,
                user: true,
              }
         });
         return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
   }
   catch (error) {
         console.error(error);
         throw new Error('Database error. See server log for details.');
   }
}

const getTaskById = async (id: number): Promise<Task | null> => {
    try {const taskPrisma = await database.task.findUnique({
        where: {id},
        include: {
            priority: true,
            user: true,
        }
    })
    return taskPrisma ? Task.from(taskPrisma) : null;
}
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getActiveTasksByUser = async (user: User): Promise<Task[]> => {
    try {
        const tasksPrisma = await database.task.findMany({
            where: {
                done: false,
                userId: user.getId()
            },
            include: {
                priority: true,
                user: true,
            }
        });
        return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
  }
}
const getTasksByPriority = async (levelName: string): Promise<Task[]> => {
    try {
        const tasksPrisma = await database.task.findMany({
            where: {
                priority: {
                    levelName
                },
                done: false
            },
            include: {
                priority: true,
                user: true,
            }
        })
        return tasksPrisma.map((taskPrisma) => Task.from(taskPrisma));
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
}


const deleteTask =  async (id: number): Promise<void> => {
    try {const taskPrisma = await database.task.delete({
        where: {id}
    })
}
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};



export default {
    createTask,
    getAllTasks,
    getTaskById,
    deleteTask,
    getActiveTasks,
    getTasksByPriority,
    getActiveTasksByUser
};
