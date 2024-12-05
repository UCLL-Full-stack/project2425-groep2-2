import { UnauthorizedError } from 'express-jwt';
import { Priority } from '../../model/priority';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import priorityDb from '../../repository/priority.db';
import taskDb from '../../repository/task.db';
import userDb from '../../repository/user.db';
import taskService from '../../service/task.service';
import { PriorityInput, UserInput } from '../../types';
import { addDays } from 'date-fns';

const priorityInput: PriorityInput = {
    id: 1,
    levelName: 'basic',
    colour: 'success',
};

const priority = new Priority({
    ...priorityInput,
});
let id = 1;
const user = new User({
    id: id,
    username: 'johnDoe',
    password: 'password1234',
    role: 'user',
});

const userInput: UserInput = {
    id: id,
    username: 'johnDoe',
    password: 'password1234',
    role: 'user',
};

const description = 'shopping 2.0';
const sidenote = 'even more shopping for food.';
const deadline = addDays(new Date(), 1);
const startDate = new Date();
const done = false;
const userId = 1;

const tasks = [
    new Task({
        id: 1,
        description: 'shopping',
        sidenote: 'need to do shopping for food.',
        startDate: new Date(),
        endDate: null,
        deadline: addDays(new Date(), 1),
        done: true,
        priority: new Priority({ id: 1, levelName: 'basic', colour: 'success' }),
        user,
    }),
    new Task({
        id: 2,
        description: 'uploading paper',
        sidenote: 'uploading a paper for a certain course',
        startDate: new Date(),
        endDate: null,
        deadline: addDays(new Date(), 4),
        done: false,
        priority: new Priority({ id: 2, levelName: 'basic', colour: 'success' }),
        user,
    }),
];

let mockUserDbgetUserByUserName: jest.Mock;
let mockPriorityDbGetPriorityById: jest.Mock;
let mockTaskDbGetActiveTasks: jest.Mock;
let mockTaskDbGetAllTasks: jest.Mock;
let mockTaskDbGetTasksByPriority: jest.Mock;
let mockTaskDbCreateTask: jest.Mock;
let mockPriorityDbGetPriorityByName: jest.Mock;
let mockPriorityDbCreatePriority: jest.Mock;

beforeEach(() => {
    mockUserDbgetUserByUserName = jest.fn();
    mockPriorityDbGetPriorityById = jest.fn();
    mockTaskDbGetActiveTasks = jest.fn();
    mockTaskDbGetAllTasks = jest.fn();
    mockTaskDbGetTasksByPriority = jest.fn();
    mockTaskDbCreateTask = jest.fn();
    mockPriorityDbGetPriorityByName = jest.fn();
    mockPriorityDbCreatePriority = jest.fn();

    userDb.getUserByUserName = mockUserDbgetUserByUserName;
    priorityDb.getPriorityById = mockPriorityDbGetPriorityById;
    taskDb.getActiveTasks = mockTaskDbGetActiveTasks;
    taskDb.getAllTasks = mockTaskDbGetAllTasks;
    taskDb.getTasksByPriority = mockTaskDbGetTasksByPriority;
    taskDb.createTask = mockTaskDbCreateTask;
    priorityDb.getPriorityByName = mockPriorityDbGetPriorityByName;
    priorityDb.createPriority = mockPriorityDbCreatePriority;

    jest.resetAllMocks();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given all tasks, when:getting all tasks, then all tasks are returned', async () => {
    //given:
    mockTaskDbGetAllTasks.mockResolvedValue(tasks);

    //when:
    const result = await taskService.getAllTasks();

    //then:
    expect(mockTaskDbGetAllTasks).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(tasks);
});

test('given: valid task, when: task is created, then task is created with those values', async () => {
    //given:
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockPriorityDbCreatePriority.mockResolvedValue(priority);
    mockTaskDbCreateTask.mockResolvedValue(
        new Task({
            description,
            sidenote,
            startDate: new Date(),
            endDate: null,
            done: false,
            deadline,
            priority,
            user,
        })
    );

    //when:
    const result = await taskService.createTask(
        {
            description,
            sidenote,
            deadline,
            priority: priorityInput,
            user: userInput,
        },
        { username: userInput.username, role: userInput.role }
    );

    //then:
    expect(mockUserDbgetUserByUserName).toHaveBeenCalledTimes(1);
    expect(mockTaskDbCreateTask).toHaveBeenCalledTimes(1);
    expect(mockTaskDbCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
            description,
            sidenote,
            startDate: expect.any(Date),
            endDate: null,
            done: false,
            deadline,
            priority: expect.objectContaining({
                id: priority.getId(),
                levelName: priority.getLevelName(),
                colour: priority.getColour(),
            }),
            user: expect.objectContaining({
                id: user.getId(),
                username: user.getUsername(),
                role: user.getRole(),
            }),
        })
    );
});

test('given no user, when: task is created, then an error is thrown', async () => {
    expect.assertions(1);
    mockUserDbgetUserByUserName.mockResolvedValue(null);

    await expect(
        taskService.createTask(
            {
                description,
                sidenote,
                deadline,
                priority: priorityInput,
                user: userInput,
            },
            { username: userInput.username, role: userInput.role }
        )
    ).rejects.toThrow(`User not found with given username: ${userInput.username}.`);
});

test('given active tasks, when:getting all active tasks, then all active tasks are returned', async () => {
    //given:
    const activeTasks = [
        new Task({
            id: 1,
            description: 'shopping',
            sidenote: 'need to do shopping for food.',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 1),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'success' }),
            user,
        }),
        new Task({
            id: 2,
            description: 'uploading paper',
            sidenote: 'uploading a paper for a certain course',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 4),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'success' }),
            user,
        }),
    ];
    mockTaskDbGetActiveTasks.mockResolvedValue(activeTasks);

    //when:
    const result = await taskService.getActiveTasks();

    //then:
    expect(mockTaskDbGetActiveTasks).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(activeTasks);
});

test('given active tasks, when:getting all active tasks, then all active tasks are returned', async () => {
    //given:
    mockTaskDbGetActiveTasks.mockResolvedValue([]);

    //when:
    const result = await taskService.getActiveTasks();

    //then:
    expect(mockTaskDbGetActiveTasks).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
});

test('given valid levelName, when: getting Tasks By Priority, then those tasks are returned', async () => {
    //given:
    mockPriorityDbGetPriorityByName.mockResolvedValue([priority]);
    mockTaskDbGetTasksByPriority.mockResolvedValue(tasks);

    //when:
    const result = await taskService.getTasksByPriority('basic', {
        username: user.getUsername(),
        role: user.getRole(),
    });

    //then:
    expect(mockPriorityDbGetPriorityByName).toHaveBeenCalledTimes(1);
    expect(mockTaskDbGetTasksByPriority).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(tasks);
});

test('given valid levelName with no tasks, when: getting Tasks By Priority, then empty list is returned', async () => {
    //given:
    mockPriorityDbGetPriorityByName.mockResolvedValue([priority]);
    mockTaskDbGetTasksByPriority.mockResolvedValue([]);

    //when:
    const result = await taskService.getTasksByPriority('urgent', {
        username: user.getUsername(),
        role: user.getRole(),
    });

    //then:
    expect(mockPriorityDbGetPriorityByName).toHaveBeenCalledTimes(1);
    expect(mockTaskDbGetTasksByPriority).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
});

test('given unknown levelName, when: getting Tasks By Priority, then an error is thrown', async () => {
    expect.assertions(1);
    mockPriorityDbGetPriorityByName.mockResolvedValue(null);

    await expect(
        taskService.getTasksByPriority('notALevel', {
            username: user.getUsername(),
            role: user.getRole(),
        })
    ).rejects.toThrow('No Priority found with levelName: notALevel.');
});

test('given invalid role, when: calling getTasks, then an error is thrown', async () => {
    const activeTasks = [
        new Task({
            id: 1,
            description: 'shopping',
            sidenote: 'need to do shopping for food.',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 1),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'success' }),
            user,
        }),
        new Task({
            id: 2,
            description: 'uploading paper',
            sidenote: 'uploading a paper for a certain course',
            startDate: new Date(),
            endDate: null,
            deadline: addDays(new Date(), 4),
            done: false,
            priority: new Priority({ levelName: 'basic', colour: 'success' }),
            user,
        }),
    ];
    mockUserDbgetUserByUserName.mockResolvedValue(user);
    mockTaskDbGetActiveTasks.mockResolvedValue(activeTasks);
    await expect(
        taskService.getTasks({ username: user.getUsername(), role: 'invalid' })
    ).rejects.toThrow(
        new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        })
    );
});
