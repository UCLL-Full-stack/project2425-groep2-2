import { Task } from "../../types"
import { table } from "console"
import React from "react"


type Props = {
    tasks:Array<Task>
}

const TaskOverview: React.FC<Props> = ({tasks}) =>{
    return (
        <>
        {tasks && 
        tasks.map((task, index)=>(
            <table className="border border-success border-opacity-50 border-4 m-2 bg-secondary bg-opacity-25">
            <tr>
                <td>Description:</td>
                <td>{task.description}</td>
            </tr>
            <tr>
                <td>Sidenote:</td>
                <td>{task.sidenote}</td>
            </tr>
            </table>
        ))
        }
        {!tasks&&
        <p>No Active Tasks</p>}
        </>
    )
}

export default TaskOverview;