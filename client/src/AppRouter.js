import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';

const AppRouter = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                {!isAuthenticated && (
                    <>
                        <Route
                            path="/login"
                            element={<Login setIsAuthenticated={setIsAuthenticated} />}
                        />
                        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated}/>} />
                    </>
                )}
                {isAuthenticated && (
                    <>
                    <Route path='/' element={ <Home />} />
                    </>
                )}

            </Routes>
        </Router>
    );
};

export default AppRouter;