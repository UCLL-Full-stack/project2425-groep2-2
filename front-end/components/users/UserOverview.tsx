import { User } from "../../types";
import React from "react"

type Props = {
    users:Array<User>
    selectUser: (user: User) => void;
}

const UserOverview: React.FC<Props> = ({users,selectUser}) =>{
    return (
        <>
        {users && 
        users.map((user, index)=>(
            <table className="border-4 m-2 bg-secondary bg-opacity-25">
            <tr key = {index}
            onClick={() => selectUser(user)}
            role="button">
                <td>user id: </td>
                <td>{user.id}</td>
            </tr>
            <tr>
                <td>username:</td>
                <td>{user.username}</td>
            </tr>
            <tr>
            </tr>
            </table>
        ))
        }
        {!users&&
        <p>No Active Users</p>}
        </>
    )
}

export default UserOverview;