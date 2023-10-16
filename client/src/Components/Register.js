import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const validatePassword = (value) => {
        // Password complexity validation
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
        return passwordRegex.test(value);
    };

    const handleRegister = async () => {
        try {
            if (!username || !password) {
                setError('All fields are required.');
                return;
            }

            if (!validatePassword(password)) {
                setError(
                    'Password must have at least 1 special character, 1 number, 1 uppercase letter, and be at least 8 characters long.'
                );
                return;
            }

            const response = await axios.post('http://localhost:4000/user', {
                username,
                password,
            });

            if (response.data.token.error) {
                setError(response.data.token.error);
                return;
            }

            const { token } = response.data;
            localStorage.setItem('token', token);
            setIsAuthenticated(true);

            navigate('/');
        } catch (error) {
            console.error('Error during registration: ', error);
            setError('Error during registration');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
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