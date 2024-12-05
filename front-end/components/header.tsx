import Link from 'next/link';
import React, { useEffect, useState } from 'react';



const Header: React.FC = () => {
 const [loggedInUser, setloggedInUser] = useState<string | null>(null);
 useEffect(() => {
  setloggedInUser(sessionStorage.getItem("loggedInUser"));
 }, [loggedInUser]);
 
  return (
    <>
    <header className=" bg-beige flex flex-row items-center justify-between m-3 p-2 rounded-2xl">
      <h1 className="fs-3 text-decoration-none text-dark-brown">
        DoneDeal
      </h1>
      <nav className="flex flex-row bg-stone-300 m-2 rounded-md justify-evenly px-2">
        <Link href="/" className="nav-link p-2 fs-6 m-1 rounded-md hover:bg-dark-beige">
          Home
        </Link>
        <Link href="/tasks" className="nav-link p-2 fs-6 text-dark  m-1 rounded-md hover:bg-dark-beige">
          All tasks
        </Link>
        <Link href="/users" className="nav-link p-2 fs-6 text-dark m-1 rounded-md hover:bg-dark-beige">
          Users
        </Link>
        {!loggedInUser && (
           <Link href="/login" className="nav-link px-4 fs-5 text-dark">
           Login
           </Link>
        )}
       
      {loggedInUser && (
        <>
        <Link href="/login" className="nav-link px-4 fs-5 text-dark"
        onClick={() => {
          sessionStorage.removeItem("loggedInUser");
          setloggedInUser(null);
        }}> Logout</Link>
        <div className="nav-link px-4 fs-5 text-dark">
          Welcome, {loggedInUser}!
        </div>
        </>
      )}
      </nav>
    </header>
    </>
  );
};

export default Header;
