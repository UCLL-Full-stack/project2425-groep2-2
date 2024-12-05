import { User } from '../model/user';
import userDb from '../repository/user.db';
import { AuthenticationResponse, UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';
import { UnauthorizedError } from 'express-jwt';

const getUsers = async ({ username, role }: any): Promise<User[]> => {
    if (role === 'admin') {
        return await userDb.getAllUsers();
    } else if (role === 'user') {
        const user = await userDb.getUserByUserName(username);
        if (!user) {
            throw new Error(`no User found with username: ${username}.`);
        }
        return [user];
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'you are not authorized to access this resource.',
        });
    }
};
const getAllUsers = async (): Promise<User[]> => {
    return await userDb.getAllUsers();
};

const getUserById = async (id: number): Promise<User> => {
    const user = await userDb.getUserById(id);
    if (!user) throw new Error(`User with id ${id} does not exists.`);
    return user;
};

const createUser = async ({ username, password, role }: UserInput): Promise<User> => {
    const existingUser = await userDb.getUserByUserName(username);
    if (existingUser) {
        throw new Error(`User with username ${username} is already registered.`);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword, role });
    const newUser = await userDb.createUser(user);
    return newUser;
};

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    const user = await userDb.getUserByUserName(username);
    if (!user) {
        throw new Error(`User with username: ${username} is not found.`);
    }
    const invalidPassword = await bcrypt.compare(password, user.getPassword());
    if (!invalidPassword) {
        throw new Error('Incorrect username or password');
    }
    return {
        token: generateJwtToken({ username, role: user.getRole().toString() }),
        username: username,
        role: user.getRole().toString(),
    };
};

export default { getUsers, getAllUsers, getUserById, createUser, authenticate };
