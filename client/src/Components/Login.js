import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({setIsAuthenticated}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

        const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/user/login', { username, password });
            // Assuming the response has a token field
            console.log('response.data: ', response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log('token', response.data.token)
                setIsAuthenticated(true);
                // Redirect the user to the home page or any other protected route
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in: ', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>
                Don`t have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    )
}

export default Login