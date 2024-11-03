import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import Header from '../components/header';
import AddTask from '../components/tasks/AddTask';


const Home: React.FC = () => {
  return (
    <>
      <Header/>
      <main>
        <section className='d-flex flex-column'>
      <h2 className='align-self-center'>Welcome!</h2>
      <p className='align-self-center'>Welcome on our task manager!</p>
      <AddTask/>
      </section>
      </main>
    </>
  );
};

export default Home;