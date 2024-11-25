import { addDays } from 'date-fns';
import { Task } from '../model/task';
import { User } from '../model/user';
import { Priority } from '../model/priority';
import database from '../util/database';
import { TaskHistory } from '../model/taskhistory';
import { de, id } from 'date-fns/locale';

// const users = [
//     new User({
//         id: 1,
//         username: 'johnDoe',
//         password: 'password1234',
//         tasks: [
//             new Task({
//                 id: 1,
//                 description: 'shopping',
//                 sidenote: 'need to do shopping for food.',
//                 startDate: new Date(),
//                 endDate: null,
//                 deadline: addDays(new Date(), 1),
//                 done: false,
//                 priority: new Priority({ levelName: 'basic', colour: 'green' }),
//                 userId: 1,
//             }),
//         ],
//     }),
//     new User({
//         id: 2,
//         username: 'OdeMalfait',
//         password: 'odespassword1324',
//         tasks: [
//             new Task({
//                 id: 2,
//                 description: 'uploading paper',
//                 sidenote: 'uploading a paper for a certain course',
//                 startDate: new Date(),
//                 endDate: null,
//                 deadline: addDays(new Date(), 4),
//                 done: false,
//                 priority: new Priority({ levelName: 'basic', colour: 'green' }),
//                 userId: 2,
//             }),
//         ],
//     }),
// ];

const getAllUsers = async (): Promise<User[]> => {
    try
    {const usersPrisma = await database.user.findMany({
        include: {
            tasks: {
                include: {
                    priority: true,
                },
            },
            taskHistory: {
                include: {
                    finishedTasks: {
                        include: {
                            priority: true,
                        },
                    },
                },
            },
        },
    });;
    return usersPrisma.map((userPrisma) => {
        return User.from(userPrisma);
});
}
catch (error) {
    throw new Error(`Database error: see server log for details.`);
}
};

const getUserById =async ({id}: {id: number}): Promise<User | null> => {
     try
     {const userPrisma = await database.user.findUnique({
        where: { id },
        include: { 
            tasks: {
                include: {
                    priority: true,
                }
            },
            taskHistory: {
                include: {
                    finishedTasks: {
                        include: {
                            priority: true,
                        }
                    }
                }
            }
        }
    })
    return userPrisma ? User.from(userPrisma): null;}
    catch (error) {
        throw new Error(`Database error: see server log for details.`);
    }
}

const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username: user.getUsername(),
                password: user.getPassword(),
            },
            include: {
                tasks: {
                    include: {
                        priority: true,
                    },
                },
            },
        });

        return User.from(userPrisma);
    } 
    catch (error){
        throw new Error(`Database error: see server log for details.`);
    }
}
    



export default {
    getAllUsers,
    getUserById,
    // addTasktoUser,
};
