
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUserAuthentication } from '../Redux/authenticationSlice';

const Login = () => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const { email, password } = formData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(baseURL+'/api/login/', formData);
            const { access, refresh, user_id, email, first_name, last_name, is_manager } = response.data;
    
            // Save tokens in localStorage
            localStorage.setItem('tokens', JSON.stringify(response.data));
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
    
            // Prepare user details for Redux
            const userDetails = {
                user_id,
                email,
                first_name,
                last_name,
                isAuthenticated: true,
                is_manager,
            };
    
            // Dispatch user details to Redux store
            dispatch(setUserAuthentication(userDetails));
    
            toast.success('Login successful! Redirecting...');
    
            // Redirect based on role
            if (is_manager) {
                navigate('/manager/home');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password');
            toast.error('Invalid login credentials');
        }
    };
    

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={email}
                                onChange={handleChange}
                                autoComplete="email" 
                                required 
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        </div>
                        <div className="mt-2">
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                value={password}
                                onChange={handleChange}
                                autoComplete="current-password" 
                                required 
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
