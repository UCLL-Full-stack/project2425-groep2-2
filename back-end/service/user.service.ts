import { User } from '../model/user';
import userDb from '../repository/user.db';

const getAllUsers = async (): Promise<User[]> => await userDb.getAllUsers();
const getUserById = async (id: number): Promise<User> => {
    const user =await userDb.getUserById({id});
    if (!user) throw new Error(`User with id ${id} does not exists.`);
    return user;
};

export default { getAllUsers, getUserById };
