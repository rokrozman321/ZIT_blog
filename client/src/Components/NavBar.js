import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';

const NavBar = ({setIsAuthenticated}) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token'); // Remove the stored token
        // Implement any other necessary logic for sign-out here

        // Redirect the user to the login page or any desired page after signing out
        // history.push('/login');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const handleToggleMode = () => {
        // Handle the dark/light mode toggle functionality here
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            <div>
                <Link to="/">
                    <button>Back</button>
                </Link>
            </div>
            <div>
                <button onClick={handleToggleMode}>Dark/Light Mode</button>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </nav>
    );
};

export default NavBar;
