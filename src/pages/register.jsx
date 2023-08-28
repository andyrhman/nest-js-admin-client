//https://chat.openai.com/share/57c51cc0-94c1-41f7-b0d8-e855edbaff9d
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import NavbarComponent from '../components/NavbarComponent';
import {
    Card,
    Input,
    Alert,
    Button,
    Typography,
} from "@material-tailwind/react";
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationService from '@/services/AuthenticationService';

const daftar = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter(); // Initialize the router instance

    const create = async (e) => {
        e.preventDefault();
        setEmailError(false);
        setPasswordError('');
        setUsernameError(false);
        setConfirmPasswordError('');
        setError('');

        const data = {
            email,
            password,
            username,
            password_confirm: confirmPassword
        };

        // Validate confirm password
        if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            return;
        }

        try {
            const response = await AuthenticationService.create(data);
            if (response.status === 200) {
                // Redirect to the login page
                router.push('/login');
            } else {
                // Sign-up failed, display an error message
                setError('An error occurred during sign-up');
            }
            console.log(response.data);
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);

                // Set error flags based on the error message
                if (errorMessage.includes('Email')) {
                    setEmailError(errorMessage);
                }
                if (errorMessage.includes('Password')) {
                    setPasswordError(errorMessage);
                }
                if (errorMessage.includes('Username')) {
                    setUsernameError(errorMessage);
                }
            }
        }
    };

    const validateUsername = async () => {
        // Reset the error message
        setUsernameError('');

        if (username === '') {
            // If the username field is empty, display an error message
            setUsernameError('Username is required');
        } else {
            // Make an API request to validate the username
            try {
                const response = await AuthenticationService.findByTitle(username);
                if (response.data.length > 0) {
                    // If the username already exists, display an error message
                    setUsernameError('Username already exists');
                }
            } catch (error) {
                // console.error(error);
                // Handle the error response if necessary
            }
        }
    };

    const validateEmail = async () => {
        // Reset the error message
        setEmailError('');

        if (email === '') {
            // If the email field is empty, display an error message
            setEmailError('Email is required');
        } else {
            // Make an API request to validate the email
            try {
                const response = await AuthenticationService.findByTitle(email);
                if (response.data.length > 0) {
                    // If the email already exists, display an error message
                    setEmailError('Email already exists');
                }
            } catch (error) {
                // console.error(error);
                // Handle the error response if necessary
            }
        }
    };

    const validatePassword = (value) => {
        setPassword(value);
        setPasswordError('');

        if (!value) {
            setPasswordError('Password is required');
        } else if (value.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
        }
    };

    const validateConfirmPassword = (value) => {
        setConfirmPassword(value);
        setConfirmPasswordError('');

        if (!value) {
            setConfirmPasswordError('Confirm Password is required');
        } else if (value !== password) {
            setConfirmPasswordError('Passwords do not match');
        }
    };


    return (
        <Layout>
            <div>
                <Head>
                    <title>Register | Blog</title>
                    <meta name="description" content="Welcome to my website" />
                </Head>
                {/* Your other page content */}
                <NavbarComponent />
                <div className="flex justify-center items-center h-screen">
                    <Card color="transparent" shadow={false}>
                        <Typography variant="h4" color="blue-gray">
                            Register
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Enter your details to register.
                        </Typography>
                        {/* ... your form inputs */}
                        {error && (
                            <Alert color="red" className="mt-2 text-center font-normal">
                                {error}
                            </Alert>
                        )}

                        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={create}>
                            <div className="mb-4 flex flex-col">
                                <div className='mb-5'>
                                    <Input
                                        size="lg"
                                        label="Username"
                                        required
                                        error={!!usernameError} // Pass the error state as a prop
                                        onChange={(e) => setUsername(e.target.value)}
                                        onBlur={validateUsername}

                                    />
                                    {usernameError && <div className="text-red-500 text-xs mt-1">{usernameError}</div>}
                                </div>

                                <div className='mb-5'>
                                    <Input
                                        size="lg"
                                        label="Email"
                                        type="email"
                                        required
                                        error={!!emailError} // Pass the error state as a prop
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={validateEmail}

                                    />
                                    {emailError && <div className="text-red-500 text-xs mt-1">{emailError}</div>}
                                </div>

                                <div className='mb-5'>
                                    <Input
                                        size="lg"
                                        label="Password"
                                        type="password"
                                        required
                                        error={!!passwordError} // Pass the error state as a prop
                                        onChange={(e) => validatePassword(e.target.value)}

                                    />
                                    {passwordError && <div className="text-red-500 text-xs mt-1">{passwordError}</div>}
                                </div>

                                <div className='mb-5'>
                                    <Input
                                        size="lg"
                                        label="Confirm Password"
                                        type="password"
                                        required
                                        error={!!confirmPasswordError} // Pass the error state as a prop
                                        onChange={(e) => validateConfirmPassword(e.target.value)}

                                    />
                                    {confirmPasswordError && <div className="text-red-500 text-xs mt-1">{confirmPasswordError}</div>}
                                </div>


                            </div>

                            <Button className="mt-6" fullWidth type='submit'>
                                Register
                            </Button>
                            <Typography color="gray" className="mt-4 text-center font-normal">
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium text-gray-900">
                                    Sign In
                                </Link>
                            </Typography>
                        </form>
                    </Card>
                </div>

            </div>
        </Layout>
    )
}

export default daftar;