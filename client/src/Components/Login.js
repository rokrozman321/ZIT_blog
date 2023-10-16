import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                setError('All fields are required.');
                return;
            }
            const response = await axios.post("http://localhost:4000/user/login", {
                username,
                password,
            });
            if (response.data.token.error) {
                setError(response.data.token.error);
                return;
            }
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                setIsAuthenticated(true);
                navigate("/");
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            setError('Error logging in');
        }
    };

    return (
        <div>
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>
            <p>
                Don`t have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default Login;
