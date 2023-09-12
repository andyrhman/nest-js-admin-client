import React, { useState, useEffect } from 'react';
import { Input, Typography, Button, Alert } from "@material-tailwind/react";
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// * Components
import AdminNavbar from "@/components/admin/Navbars/AdminNavbar.js";
import Sidebar from "@/components/admin/Sidebar/Sidebar.js";
import FooterAdmin from "@/components/admin/Footers/FooterAdmin.js";
import Layout from "@/components/Layout";
import AuthenticationService from '@/services/AuthenticationService';
import http from '@/services/Api';

const profile = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [error, setError] = useState('');
    const [strength, setStrength] = useState(0);

    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await http.get('/user');

                    setUsername(data.username);
                    setEmail(data.email);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        setError('An error occurred');
                        router.push('/login');
                    }
                }

            }
        )();

    }, []);

    const infoSubmit = async (e) => {
        e.preventDefault();
        setEmailError(false);
        setUsernameError(false);
        setError('');

        try {
            await http.put('/users/info', {
                username,
                email
            });
            // Show a success message using React Toastify
            toast.success('Info Updated Successfully!.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide
            });
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);

                // Set error flags based on the error message
                if (errorMessage.includes('Email')) {
                    setEmailError(errorMessage);
                }
                if (errorMessage.includes('Username')) {
                    setUsernameError(errorMessage);
                }
            }
        }
    };

    const passwordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setConfirmPasswordError('');
        setError('');

        // Validate confirm password
        if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return;
        }

        try {
            await http.put('/users/password', {
                password,
                confirm_password: confirmPassword
            });

            toast.success('Password Updated Successfully!.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Slide
            });
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);

                // Set error flags based on the error message
                if (errorMessage.includes('Password')) {
                    setPasswordError(errorMessage);
                }
            }
        }
    };


    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.match(/[a-z]/)) strength++; // lower case letter
        if (password.match(/[A-Z]/)) strength++; // upper case letter
        if (password.match(/[0-9]/)) strength++; // number
        if (password.match(/[^a-zA-Z0-9]/)) strength++; // special character
        if (password.length >= 6) strength++; // length 8 or more
        return strength;
    }

    const validatePassword = (value) => {
        setPassword(value);
        setPasswordError('');
        const strength = checkPasswordStrength(value);
        setStrength(strength);

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

    const strengthBarColor = () => {
        switch (strength) {
            case 1: return 'red';
            case 2: return 'orange';
            case 3: return 'yellow';
            case 4: return 'lime';
            case 5: return 'green';
            default: return 'gray';
        }
    }

    const strengthText = () => {
        switch (strength) {
            case 1: return 'Too short';
            case 2: return 'Weak';
            case 3: return 'Okay';
            case 4: return 'Good';
            case 5: return 'Strong';
            default: return '';
        }
    }

    return (
        <Layout>
            <Sidebar />
            <div className="relative md:ml-64">
                <AdminNavbar />
                <div className="relative md:pt-32 pb-32 pt-12">
                    <div className="px-4 md:px-10 mx-auto w-full">

                        <div className="flex flex-wrap">

                            <div className="flex w-full flex-col gap-2">
                                <form onSubmit={infoSubmit}>
                                    {error && (
                                        <Alert color="red" className="mt-2 text-center font-normal">
                                            {error}
                                        </Alert>
                                    )}

                                    <Typography color="blue-gray" variant='h4'>
                                        Account Information
                                    </Typography>
                                    <div className="mt-2">
                                        <Typography color="blue-gray" variant='small'>
                                            Username
                                        </Typography>
                                        <Input
                                            color="blue"
                                            defaultValue={username}
                                            icon={<i className="fa-solid fa-signature" />}
                                            required
                                            error={!!usernameError} // Pass the error state as a prop
                                            onChange={(e) => setUsername(e.target.value)}                                          
                                        />
                                        {usernameError && <div className="text-red-500 text-xs mt-1">{usernameError}</div>}
                                    </div>
                                    <div className="mt-2">
                                        <Typography color="blue-gray" variant='small'>
                                            Email
                                        </Typography>
                                        <Input
                                            color="blue"
                                            type='email'
                                            defaultValue={email}
                                            icon={<i className="fa-solid fa-envelope" />}
                                            required
                                            error={!!emailError} // Pass the error state as a prop
                                            onChange={(e) => setEmail(e.target.value)}                                         
                                        />
                                        {emailError && <div className="text-red-500 text-xs mt-1">{emailError}</div>}
                                    </div>
                                    <div className='mt-2'>
                                        <Button type='submit' className="flex items-center gap-3" size="md" color='green' variant='outlined'>
                                            <i className="fa-solid fa-floppy-disk" /> Save
                                        </Button>
                                    </div>
                                </form>

                            </div>


                            <div className="flex w-full flex-col gap-2 mt-16">
                                <form onSubmit={passwordSubmit}>
                                    <Typography color="blue-gray" variant='h4'>
                                        Change Password
                                    </Typography>
                                    <div className='mt-2'>
                                        <Input
                                            size="lg"
                                            label="Password"
                                            type="password"
                                            required
                                            error={!!passwordError} // Pass the error state as a prop
                                            onChange={(e) => validatePassword(e.target.value)}
                                        />
                                        <div style={{
                                            fontSize: '12px',
                                            textAlign: 'right',
                                            color: strengthBarColor(),
                                        }}>
                                            {strengthText()}
                                        </div>
                                        <div style={{
                                            height: '10px',
                                            width: `${strength * 20}%`,
                                            backgroundColor: strengthBarColor(),
                                            transition: 'width 0.3s ease-in-out',
                                        }} />
                                        {passwordError && <div className="text-red-500 text-xs mt-1">{passwordError}</div>}
                                    </div>
                                    <div className="mt-2">
                                        <Typography color="blue-gray" variant='small'>
                                            Confirm Password
                                        </Typography>
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
                                    <div className='mt-2'>
                                        <div className='flex'>
                                            <Button type='submit' className="flex items-center gap-3" size="md" color='green' variant='outlined'>
                                                <i className="fa-solid fa-floppy-disk" /> Save
                                            </Button>
                                            {/* <Button className="flex items-center gap-3 ml-4" size="md" color='red'>
                                        <i class="fa-solid fa-floppy-disk" /> Save
                                    </Button> */}
                                        </div>
                                    </div>
                                </form>
                            </div>




                        </div>

                    </div>
                </div>
            </div>
            <FooterAdmin />
        </Layout>
    )
}

export default profile