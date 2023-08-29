import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import NavbarComponent from '../components/NavbarComponent';
import {
    Card,
    Input,
    Alert,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import axios from 'axios';
// import AuthenticationService from '@/services/AuthenticationService';

const masuk = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter(); // Initialize the router instance

    const submit = async (e) => {
        e.preventDefault();
        setUsernameError(false);
        setPasswordError('');
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            }, { withCredentials: true });
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            axios.defaults.headers.common['Refresh-Token'] = `Bearer ${data.refreshToken}`;
            if (data) {
                // Redirect to the login page
                router.push('/');
            } else {
                // Sign-in failed, display an error message
                setError('An error occurred during sign-in');
            }
            console.log(data);
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);

                // Set error flags based on the error message
                if (errorMessage.includes('Username')) {
                    setUsernameError(errorMessage);
                }
                if (errorMessage.includes('Password')) {
                    setPasswordError(errorMessage);
                }
            }
        }
    };

    const validatePassword = (value) => {
        setPassword(value);
        setPasswordError('');

        if (!value) {
            setPasswordError('Password is required');
        }
    };

    return (
        <Layout>
            <div>
                <Head>
                    <title>Sign in | Blog</title>
                    <meta name="description" content="Welcome to my website" />
                </Head>
                {/* Your other page content */}
                <NavbarComponent />
                <div className="flex justify-center items-center h-screen">
                    <Card color="transparent" shadow={false}>
                        <Typography variant="h4" color="blue-gray">
                            Sign In
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Enter your details to sign-in.
                        </Typography>
                        {/* ... your form inputs */}
                        {error && (
                            <Alert color="red" className="mt-2 text-center font-normal">
                                {error}
                            </Alert>
                        )}
                        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={submit}>
                            <div className="mb-4 flex flex-col">
                                <div className='mb-5'>
                                    <Input
                                        size="lg"
                                        label="Username"
                                        required
                                        error={!!usernameError} // Pass the error state as a prop
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    {/* {usernameError && <div className="text-red-500 text-xs mt-1">{usernameError}</div>} */}
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
                                    {/* {passwordError && <div className="text-red-500 text-xs mt-1">{passwordError}</div>} */}
                                </div>
                            </div>
                            <Checkbox
                                label={
                                    <Typography
                                        variant="small"
                                        color="gray"
                                        className="flex items-center font-normal"
                                    >
                                        Remember Me
                                        <a
                                            href="#"
                                            className="font-medium transition-colors hover:text-gray-900"
                                        >
                                        </a>
                                    </Typography>
                                }
                                containerProps={{ className: "-ml-2.5" }}
                            />
                            <Button className="mt-6" fullWidth type='submit'>
                                Login
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    )
}

export default masuk