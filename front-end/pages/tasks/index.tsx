
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Task } from '../../types';
import TaskService from '../../services/TaskService';
import Header from '../../components/header';
import TaskOverview from '../../components/tasks/TaskOverview';



const Tasks: React.FC = () => {
    const [tasks,setTasks] = useState<Array<Task>>();


    const getTasks = async () =>{
        const res = await TaskService.getAllTasks()
        const taskss = await res.json()
        setTasks(taskss)
    }
    useEffect(() => {
        getTasks(),
        []
    })

  return (
    <>
    <Head>
        <title>Tasks</title>
    </Head>
    <Header/>
    <main className='d-flex flex-column align-items-center'>
    <h1>Tasks</h1>
    <section className='d-flex flex-row p-2 '>
    <TaskOverview tasks={tasks}></TaskOverview>
    </section>
    </main>
    </>
  );
};

export default Tasks;