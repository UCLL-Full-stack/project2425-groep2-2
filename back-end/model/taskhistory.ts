import { Task } from './task';
import { User } from './user';
import {
    TaskHistory as TaskHistoryPrisma,
    Task as TaskPrisma,
    Priority as PriorityPrisma,
} from '@prisma/client';

export class TaskHistory {
    private id?: number;
    private userId: number;
    private finishedTasks: Task[];

    constructor(task: { id?: number; userId: number; finishedTasks: Task[] }) {
        this.userId = task.userId;
        this.finishedTasks = task.finishedTasks;
    }

    getId(): number | undefined {
        return this.id;
    }
    getUserId(): number {
        return this.userId;
    }
    getFinishedTasks(): Task[] {
        return this.finishedTasks;
    }
    addFinishedTask(task: Task): void {
        if (task.getDone() === false) {
            throw new Error('Task is not done.');
        } else {
            this.finishedTasks.push(task);
        }
    }
    static from({
        id,
        userId,
        finishedTasks,
    }: TaskHistoryPrisma & { finishedTasks: (TaskPrisma & { priority: PriorityPrisma })[] }) {
        {
            return new TaskHistory({
                id,
                userId,
                finishedTasks: finishedTasks.map((task) => Task.from(task)),
            });
        }
    }
}
