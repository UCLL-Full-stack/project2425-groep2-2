/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *       Task:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            description:
 *              type: string
 *              description: Title of the task.
 *            sidenote:
 *              type: string
 *              description: details of the task.
 *            startDate:
 *              type: string
 *              format: date-time
 *              description: date when the task is made/started.
 *            endDate:
 *              type: string
 *              format: date-time
 *              description: date when the task is completed.
 *            deadline: 
 *              type: string
 *              format: date-time
 *              description: due date of the task.
 *            status:
 *              type: boolean
 *              description: status of the task is completed or not.
 *            priority:
 *              type: object
 *              properties:
 *                    levelName:
 *                        type: string
 *                    colour:
 *                        type: string
 *              description: the level of priority of the task.
 *            userId:
 *              type: number
 *              format: int64
 *       TaskInput:
    *          type: object
    *          properties:
    *            id:
    *              type: number
    *              format: int64
    *            description:
    *              type: string
    *            sidenote:
    *              type: string
    *            deadline: 
    *              type: string
    *              format: date-time
    *              description: due date of the task.
    *            priority:
    *              type: object
    *              properties:
    *                 levelName:
    *                      type: string
    *                 colour:
    *                      type: string
    *            userId:
    *              type: number
    *              format: int64
 */
import express, {NextFunction, Request, Response} from 'express';
import taskService from '../service/task.service';
import { Role, TaskInput } from '../types';

const taskRouter = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all Tasks.
 *     responses:
 *       200:
 *         description: A list of Tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Task'
 */
taskRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const tasks = await taskService.getTasks({ username, role });
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /tasks/active:
 *   get:
 *     summary: Get a list of all tasks which are not finished/active.
 *     responses:
 *       200:
 *         description: A list of Active Tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Task'
 */
taskRouter.get("/active",async ( req: Request, res: Response, next: NextFunction) => {
    try {
        const activeTasks = await taskService.getActiveTasks();
        res.status(200).json(activeTasks);
    } catch (error) {
        next(error)
    }
})



/**
 * @swagger
 * /tasks:
 *   post:
 *      security:
 *       - bearerAuth: []
 *      summary: Create a new task for a existing user.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TaskInput'
 *      responses:
 *         200:
 *            description: The created task.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Task'
 */
taskRouter.post("/",async(req:Request, res:Response,next:NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const task = <TaskInput>req.body;
        const result = await taskService.createTask(task,{username,role});
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }

}) ;
/**
 * @swagger
 * /tasks/priority/{levelName}:
 *  get:
 *      security:
 *       - bearerAuth: []
 *      summary: Get Tasks by Priority.
 *      parameters:
 *          - in: path
 *            name: levelName
 *            schema:
 *              type: string
 *              required: true
 *              description: The level name of the priority.
 *      responses:
 *       200:
 *         description: A list of Tasks with the given priority.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Task'
 */
taskRouter.get("/priority/:levelName",async ( req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const tasks = await taskService.getTasksByPriority(String(req.params.levelName),{username,role});
        res.status(200).json(tasks);
    } catch (error) {
        next(error)
    }
})

export {taskRouter}