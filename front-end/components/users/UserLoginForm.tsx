import { useState } from "react";
import { useRouter } from "next/router";
import { StatusMessage } from "../../types";
import classNames from "classnames";
const UserLoginFrom: React.FC = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [nameError, setNameError] = useState<string | null>(null)
    const [statusMessage, setStatusMessage] = useState<StatusMessage[]>([]);
    
    const clearErrors = () =>  {
        setNameError("");
        setStatusMessage([]);
    }
    const validate = (): boolean => {
        let result = true;
        if (!username && username.trim() === "") {
            setNameError("Username is required.")
            result = false;
            };
        return result;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        clearErrors();
        if (!validate()) {
            return;
        }
        setStatusMessage([{
            message:"Login successfull. Redirecting to homepage...",
            type:"success"
        },]);
        sessionStorage.setItem("loggedInUser",username);
        setTimeout(() => {
            router.push("/");
        },2000);
    };

    return (
        <>
        <h3>Login</h3>
        {statusMessage && (
            <div>
                <ul className="list-none">
                    {statusMessage.map(({message,type},index) => (
                        <li 
                        key={index}
                        className={classNames({
                            "text-red-800": type =="error",
                            "text-green-800": type =="success",
                        })} >
                            {message}
                        </li>
                    ) )}
                </ul>
            </div>
        )}
        <form  onSubmit={(event) => (handleSubmit(event))} className="flex flex-center flex-col p-3">
            <div className="flex-row">
            <label htmlFor="nameInput">
                Username: 
            </label>
            
            <input className="mx-2 border-2 border-gray-300"
            id="nameInput"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            />
            {nameError && <div className="text-red-800 text-center"> {nameError} </div>}
            </div>
            <button type="submit" className="m-2 border-2 border-orange-500 bg-orange-300 text-orange-50">Login</button>
        </form>
       
        </>
    ); 
};
export default UserLoginFrom
