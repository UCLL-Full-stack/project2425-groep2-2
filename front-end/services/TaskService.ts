const getAllTasks = async () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks",{
        method:'GET',
        headers: {
            'Content-type':'application/json',
        }
    })

}


    const createTask = async (task: { description: string; sidenote: string; deadline: Date,priority:{levelName:string,colour:string}, userId:number }) => {
        return fetch(process.env.NEXT_PUBLIC_API_URL + "/tasks", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(task),
        });
    };

const TaskService = {
    getAllTasks,
    createTask,
}

export default TaskService