import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Alert
} from "@material-tailwind/react";
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authenticationService from "@/services/AuthenticationService";
import http from "@/services/Api";

const CreateUser = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [role_id, setRoleId] = useState('');
    const [roleIdError, setRoleIdError] = useState(false);
    const [error, setError] = useState('');

    const [roles, setRoles] = useState([])

    const router = useRouter();
    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await http.get('/roles');
                    setRoles(data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        setError('An error occurred');
                        router.push('/login');
                    }

                    if (error.response && error.response.status === 403) {
                        setError('An error occurred');
                        router.push('/login');
                    }
                }

            }
        )()

    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setEmailError(false);
        setUsernameError(false);
        setRoleIdError(false);
        setError('');

        try {
            const { data } = await http.post('/users', {
                username,
                email,
                role_id
            });
            if (data) {
                // Show a success message using React Toastify
                toast.success('User Created Successfully!.', {
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
                }, 2000);
                onClose();
            } else {
                // Sign-in failed, display an error message
                setError('An error occurred during sign-in');
            }
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);

                // Set error flags based on the error message
                if (errorMessage.includes('Username')) {
                    setUsernameError(errorMessage);
                }
                if (errorMessage.includes('Email')) {
                    setEmailError(errorMessage);
                }
                if (errorMessage.includes('Email')) {
                    setRoleIdError(errorMessage);
                }
            }
        }

    }


    // * Validation
    const validateUsername = async () => {
        // Reset the error message
        setUsernameError('');

        if (username === '') {
            // If the username field is empty, display an error message
            setUsernameError('Username is required');
        } else {
            // Make an API request to validate the username
            try {
                const response = await authenticationService.findByTitle(username);
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
                const response = await authenticationService.findByTitle(email);
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

    return (
        <>
            <Dialog open={isOpen} handler={onClose}>
                <div className="flex items-center justify-between">
                    <DialogHeader>Create New User</DialogHeader>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="mr-3 h-5 w-5"
                        onClick={onClose} // Change this line
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <form onSubmit={submit}>
                    <DialogBody divider>
                        <div className="grid gap-6">
                            {error && (
                                <Alert color="red" className="mt-2 text-center font-normal">
                                    {error}
                                </Alert>
                            )}

                            <div className="mb-5">
                                <Input
                                    label="Username"
                                    required
                                    error={!!usernameError} // Pass the error state as a prop
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={validateUsername}

                                />
                                {usernameError && <div className="text-red-500 text-xs mt-1">{usernameError}</div>}
                            </div>
                            <div className="mb-5">
                                <Input
                                    label="Email"
                                    type="email"
                                    required
                                    error={!!emailError} // Pass the error state as a prop
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={validateEmail}

                                />
                                {emailError && <div className="text-red-500 text-xs mt-1">{emailError}</div>}
                            </div>

                            <div className="mb-5">
                                <Select
                                    label="Select Role"
                                    error={!!roleIdError}
                                    value={`${role_id}`} // Convert roleId to a string using template literals
                                    onChange={newValue => setRoleId(newValue)}
                                >
                                    {roles.map((role) => {
                                        return (
                                            <Option key={role.id} value={`${role.id}`}>{role.name}</Option>
                                        )
                                    })}


                                </Select>
                                {roleIdError && <div className="text-red-500 text-xs mt-1">{roleIdError}</div>}
                            </div>



                        </div>
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                        <Button variant="outlined" color="red" onClick={onClose}>
                            close
                        </Button>
                        <Button variant="gradient" color="blue" type='submit'>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    );
}

export default CreateUser;