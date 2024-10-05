import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from 'sonner'; // Import Toaster and toast

const Register = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;

    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: '',
        is_manager: false,
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // React Router hook for navigation

    const { email, first_name, last_name, password, password2, is_manager } = formData;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(baseURL+"/api/register/", formData);
            console.log(response.data);
            // Show success toast message
            toast.success('Registration successful! Redirecting to login...');
            // Redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setErrors(err.response.data);
            toast.error('Registration failed! Please fix the errors.');
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <Toaster position="top-right" /> {/* Add Toaster component */}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create an account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                            className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@company.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">First Name</label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={first_name}
                            onChange={handleChange}
                            autoComplete="given-name"
                            required
                            className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
                    </div>

                    <div>
                        <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">Last Name</label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={last_name}
                            onChange={handleChange}
                            autoComplete="family-name"
                            required
                            className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                            className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                        <input
                            id="password2"
                            name="password2"
                            type="password"
                            value={password2}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                            className="bg-gray-50 border border-gray-300 text-black rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        {errors.password2 && <p className="text-red-500 text-sm">{errors.password2}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="is_manager"
                            name="is_manager"
                            type="checkbox"
                            checked={is_manager}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="is_manager" className="ml-2 block text-sm font-medium text-gray-900">Manager</label>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Create account
                        </button>
                    </div>

                    {errors.detail && <p className="text-red-500 text-sm">{errors.detail}</p>}

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
