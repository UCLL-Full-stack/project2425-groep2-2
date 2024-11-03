import Link from 'next/link';
import React from 'react';



const Header: React.FC = () => {
  return (
    <>
    <header className="p-3 mb-3 border-bottom bg-secondary bg-opacity-50">
      <a className="fs-2 d-flex justify-content-center mb-2 mb-lg-0 text-dark text-decoration-none ">
        {' '}
        DoneDeal
      </a>
      <nav className="nav d-flex flex-row justify-content-center">
        <Link href="/" className="nav-link px-4 fs-5 text-dark">
          Home
        </Link>
        <Link href="/tasks" className="nav-link px-4 fs-5 text-dark">
          Tasks
        </Link>
      </nav>
    </header>
    </>
  );
};

export default Header;
