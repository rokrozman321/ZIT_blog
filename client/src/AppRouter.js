import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import PostDetail from './Components/PostDetail';

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
                        <Route path='*' element={<Navigate to='/login' replace />} />
                    </>
                )}
                {isAuthenticated && (
                    <>
                        <Route exact path='*' element={<Home />} />
                        <Route path='/post/:postId' element={<PostDetail />} />
                    </>
                )}

            </Routes>
        </Router>
    );
};

export default AppRouter;