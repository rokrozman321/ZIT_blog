import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = ({setIsAuthenticated}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:4000/user', {
                username,
                password,
            });

            const { token } = response.data;
            console.log('token', token);
            sessionStorage.setItem('token', token); // Save the token to session storage
            setIsAuthenticated(true);

            // Redirect the user to the login page or another route
            navigate('/');
        } catch (error) {
            console.error('Error during registration: ', error);
        }
    };

  return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
  )
}

export default Register