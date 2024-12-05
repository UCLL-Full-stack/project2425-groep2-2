import { UnauthorizedError } from 'express-jwt';
import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import { UserInput } from '../../types';

const admin = new User({
    id: 1,
    username: 'johnDoe',
    password: 'password1234',
    role: 'admin',
});

const userInputAdmin: UserInput = {
    id: 1,
    username: 'johnDoe',
    password: 'password1234',
    role: 'admin',
};

const user2 = new User({
    id: 1,
    username: 'johnDoe',
    password: 'password1234',
    role: 'user',
});

const userInput2: UserInput = {
    id: 1,
    username: 'johnDoe',
    password: 'password1234',
    role: 'user',
};
const users = [admin, user2];

let mockUserDbgetAllUsers: jest.Mock;
let mockUserDbgetUserByUserName: jest.Mock;
let mockUserDbgetUserById: jest.Mock;

mockUserDbgetAllUsers = jest.fn();
mockUserDbgetUserByUserName = jest.fn();
mockUserDbgetUserById = jest.fn();

userDb.getAllUsers = mockUserDbgetAllUsers;
userDb.getUserByUserName = mockUserDbgetUserByUserName;
userDb.getUserById = mockUserDbgetUserById;
beforeEach = () => {
    jest.clearAllMocks();
};
afterEach = () => {
    jest.clearAllMocks();
};

test('given valid admin role, when getUsers, then all users are returned', async () => {
    //given
    mockUserDbgetAllUsers.mockResolvedValue(users);
    //when:
    const result = await userService.getUsers({
        username: admin.getUsername(),
        role: admin.getRole(),
    });
    //then:
    expect(mockUserDbgetAllUsers).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
    expect(result).toEqual(users);
});
test('given valid user role, when getUsers, then only the given user is returned', async () => {
    //given:
    mockUserDbgetUserByUserName.mockResolvedValue(user2);
    //when:
    const result = await userService.getUsers({
        username: user2.getUsername(),
        role: user2.getRole(),
    });
    //then:
    expect(mockUserDbgetUserByUserName).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result).toEqual([user2]);
});
test('given guest role, when getUsers, then unauthorizedError is thrown', async () => {
    //when:
    const result = async () => {
        await userService.getUsers({
            username: user2.getUsername(),
            role: 'guest',
        });
    };
    //then:
    expect(result).rejects.toThrow(
        new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        })
    );
});
test('given user role and unknown user, when getUsers, then error is thrown', async () => {
    //given:
    expect.assertions(1);
    mockUserDbgetUserByUserName.mockResolvedValue(null);
    //when:
    const result = userService.getUsers({
        username: 'unknown',
        role: 'user',
    });
    //then:
    await expect(result).rejects.toThrow(`no User found with username: unknown.`);
});
test('given valid list of users, when calling AllUsers, allUsers are returned', async () => {
    //given
    mockUserDbgetAllUsers.mockResolvedValue(users);
    //when:
    const result = await userService.getAllUsers();
    //then:
    expect(mockUserDbgetAllUsers).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    expect(result).toEqual(users);
});

test('given valid user, when calling getUserById, then this user is returned', async () => {
    //given:
    mockUserDbgetUserById.mockResolvedValue(admin);
    //when:
    const result = await userService.getUserById(1);
    //then:
    expect(mockUserDbgetUserById).toHaveBeenCalledTimes(1);
    expect(result).toEqual(admin);
});
test('given unknown user, when calling getUserById', async () => {
    //given:
    mockUserDbgetUserById.mockResolvedValue(null);
    //when:
    const result = async () => await userService.getUserById(1);
    //then:
    expect(mockUserDbgetUserById).toHaveBeenCalledTimes(1);
    await expect(result).rejects.toThrow('User with id 1 does not exists.');
});
