import { useState } from "react";
import TaskService from "../../services/TaskService";
import { useRouter } from "next/router";


const AddTask: React.FC = () =>{
    const router = useRouter();
    const [task, setTask] = useState({
        description: '',
        sidenote: '',
        deadline: '',
      });

    const [priority, setPriority] = useState({
        levelName: '',
        colour: 'primary' 
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setTask((prevTask) => ({
        ...prevTask,
        [name]: value,
        }));
    };

    const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setPriority({
            levelName: value,
            colour: getPriorityColor(value), 
        });

    };

    const getPriorityColor = (level: string) => {
        switch (level) {
            case "High":
                return "danger"; 
            case "Medium":
                return "warning"; 
            case "Low":
                return "success"; 
            default:
                return ""; 
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        const taskToSubmit = {
            description: task.description,
            sidenote: task.sidenote,
            deadline: new Date(task.deadline),
            priority: {
                levelName: priority.levelName,
                colour: priority.colour, 
            },
            userId:1,
        };

        const response =await TaskService.createTask(taskToSubmit);
        console.log(response)
        setTask({
            description: '',
            sidenote: '',
            deadline: '',
        });
        setPriority({
            levelName: '',
            colour: '',
        });
        setUserId(null);
        setIsSubmitting(false);
        router.push("/tasks")
        }

    return (
        <>
        <form onSubmit={handleSubmit}>
      <h2>Create a To do:</h2>
      
      <div>
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="sidenote">Side note:</label>
        <textarea
          id="sidenote"
          name="sidenote"
          value={task.sidenote}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={task.deadline}
          onChange={handleChange}
          required
        />
      </div>

      <div>
            <label htmlFor="priorityLevel">Priority Level:</label>
            <select
                id="priorityLevel"
                name="levelName"
                value={priority.levelName}
                onChange={handlePriorityChange}
                required
            >
                <option value="">Select priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>
    </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Add Task'}
      </button>

    </form>
        </>
    )
}

export default AddTask