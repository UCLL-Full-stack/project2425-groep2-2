import { addDays } from 'date-fns';
import { Priority } from '../../model/priority';
import { Task } from '../../model/task';
import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import taskhistoryDb from '../../repository/taskhistory.db';
import { TaskHistory } from '../../model/taskhistory';
import taskhistoryService from '../../service/taskhistory.service';
import taskDb from '../../repository/task.db';

const user = new User({
    id: 1,
    username: 'johnDoe',
    password: 'password1234',
    role:'user'
});
const task = new Task({
    id: 4,
    description: 'walking',
    sidenote: 'walking the dog.',
    startDate: new Date(),
    endDate: null,
    deadline: addDays(new Date(), 1),
    done: false,
    priority: new Priority({ levelName: 'basic', colour: 'success' }),
    user,
});

const finishedTask = new Task({
    id: 3,
    description: 'finishedTask',
    sidenote: 'finished this task.',
    startDate: new Date(),
    endDate: null,
    deadline: addDays(new Date(), 1),
    done: true,
    priority: new Priority({ levelName: 'basic', colour: 'success' }),
    user,
});
const taskHistory = new TaskHistory({ user, finishedTasks: [finishedTask] });

let mockUserDbgetUserById: jest.Mock;
let mockTaskHistoryDbGetTaskHistoryByUser: jest.Mock;
let mockTaskDbGetTaskById: jest.Mock;
let mockTaskDbDeleteTask: jest.Mock;

beforeEach(() => {
    mockUserDbgetUserById = jest.fn();
    mockTaskHistoryDbGetTaskHistoryByUser = jest.fn();
    mockTaskDbGetTaskById = jest.fn();
    mockTaskDbDeleteTask = jest.fn();

    
});

afterEach(() => {
    jest.clearAllMocks();
});

test("given valid task and user; when getting finished tasks from user's taskhistory; then finished tasks are returned", async () => {
    //given:
    userDb.getUserById = mockUserDbgetUserById.mockResolvedValue(user);
    taskhistoryDb.getTaskHistoryByUser =
        mockTaskHistoryDbGetTaskHistoryByUser.mockResolvedValue(taskHistory);
    //when:
    const result = await taskhistoryService.getAllFinishedTasksByUser(1,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(mockUserDbgetUserById).toHaveBeenCalledTimes(1);
    expect(mockTaskHistoryDbGetTaskHistoryByUser).toHaveBeenCalledTimes(1);
    expect(result).toEqual(taskHistory.getFinishedTasks());
});

test('given unknkown userid; when getting finished tasks from takshistory; then error is thrown', async () => {
    //given:
    userDb.getUserById = mockUserDbgetUserById.mockResolvedValue(null);
    //when:
    const testing = async () => await taskhistoryService.getAllFinishedTasksByUser(505,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(testing).rejects.toThrow(`No user found with id 505.`);
});

test('given invalid userId; when getting finished tasks from taskhistory, then error is thrown;', async () => {
    //when
    const testing = async () =>await  taskhistoryService.getAllFinishedTasksByUser(0,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(testing).rejects.toThrow('Userid is required.');
});
test('given user without history; when getting finished tasks from taskhistory, then error is thrown;', async() => {
    //given
    userDb.getUserById = mockUserDbgetUserById.mockResolvedValue(user);
    taskhistoryDb.getTaskHistoryByUser =
        mockTaskHistoryDbGetTaskHistoryByUser.mockResolvedValue(null);
    //when
    const testing = async () => await taskhistoryService.getAllFinishedTasksByUser(1,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(testing).rejects.toThrow('No history found by user.');
});

test('given valid user and task; when adding task to taskhistory; then task is pushed to taskhistory and returned', async () => {
    userDb.getUserById = mockUserDbgetUserById.mockResolvedValue(user);
    taskhistoryDb.getTaskHistoryByUser =
        mockTaskHistoryDbGetTaskHistoryByUser.mockResolvedValue(taskHistory);
    taskDb.getTaskById = mockTaskDbGetTaskById.mockResolvedValue(task);
    taskDb.deleteTask = mockTaskDbDeleteTask;
    //when:
    await taskhistoryService.addFinishedTaskToHistoryByUser(1, 4,{username: user.getUsername(),role:user.getRole()});
    //then
    expect(mockTaskDbGetTaskById).toHaveBeenCalledTimes(1);
    expect(mockTaskHistoryDbGetTaskHistoryByUser).toHaveBeenCalledTimes(1);
    expect(mockTaskDbGetTaskById).toHaveBeenCalledTimes(1);
});

test('given invalid userId; when adding task to history; then: error is thrown;', async() => {
    const testing = async () => await taskhistoryService.addFinishedTaskToHistoryByUser(0, 3,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(testing).rejects.toThrow('Userid is required.');
});

test('given invalid taskId; when when adding task to history; then: error is thrown;', async () => {
    const testing = async () => await taskhistoryService.addFinishedTaskToHistoryByUser(1, 0,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(testing).rejects.toThrow('TaskId is required.');
});

test('given unknkown userid; when when adding task to history; then error is thrown', async () => {
    //given:
    userDb.getUserById = mockUserDbgetUserById.mockResolvedValue(null);
    //when:
    const testing = async () => await taskhistoryService.addFinishedTaskToHistoryByUser(505, 1,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(testing).rejects.toThrow(`No user found with id 505.`);
});
test('given unknkown taskid; when when adding task to history; then error is thrown', async () => {
    //given:
    userDb.getUserById = mockUserDbgetUserById.mockResolvedValue(user);
    taskhistoryDb.getTaskHistoryByUser =
        mockTaskHistoryDbGetTaskHistoryByUser.mockResolvedValue(taskHistory);
    taskDb.getTaskById = mockTaskDbGetTaskById.mockResolvedValue(null);
    //when:
    const testing = async () => await taskhistoryService.addFinishedTaskToHistoryByUser(1, 505,{username: user.getUsername(),role:user.getRole()});
    //then:
    expect(testing).rejects.toThrow(`No task found with id 505.`);
});

test('given task that is not from user; when adding task to taskhistory; then task is pushed to taskhistory and returned', async () => {
    const user2 = new User({id: 2, username: 'janeDoe', password: 'password1234',role:"user"});
    const user2Task = new Task({
        id: 5,
        description: 'walking',
        sidenote: 'walking the dog.',
        startDate: new Date(),
        endDate: null,
        deadline: addDays(new Date(), 1),
        done: false,
        priority: new Priority({ levelName: 'basic', colour: 'success' }),
        user: user2,
    });
    userDb.getUserById = mockUserDbgetUserById.mockResolvedValue(user);
    taskhistoryDb.getTaskHistoryByUser =
        mockTaskHistoryDbGetTaskHistoryByUser.mockResolvedValue(taskHistory);
    taskDb.getTaskById = mockTaskDbGetTaskById.mockResolvedValue(user2Task);
    //when:
    const testing = async () => await taskhistoryService.addFinishedTaskToHistoryByUser(1, 4,{username: user.getUsername(),role:user.getRole()});
    //then
    expect(testing).rejects.toThrow('The task is not from owner with id 1.');
});
