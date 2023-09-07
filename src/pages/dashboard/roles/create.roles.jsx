import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Checkbox,
    Alert,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
} from "@material-tailwind/react";
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from "@/services/Api";

const CreateRole = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([]);

    const [error, setError] = useState('');

    const [roles, setRoles] = useState([])

    const router = useRouter();
    useEffect(() => {

        (
            async () => {
                try {
                    const { data } = await http.get('/permissions');
                    setPermissions(data);
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

    const check = (id) => {
        if (selected.some(s => s === id)) {
            setSelected(selected.filter(s => s !== id));
            return;
        }
        setSelected([...selected, id]);
    }

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await http.post('/roles', {
                name,
                permissions: selected
            });
            if (data) {
                // Show a success message using React Toastify
                toast.success('Role Created Successfully!.', {
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
            }
        }

    }

    return (
        <>
            <Dialog open={isOpen} handler={onClose} size="lg">
                <div className="flex items-center justify-between">
                    <DialogHeader>Create Role</DialogHeader>
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
                                    label="Name"
                                    required
                                    onChange={(e) => setName(e.target.value)}

                                />
                            </div>

                            <div className="mb-5">
                                <Typography color="blue-gray" className="font-medium">
                                    Permissions
                                </Typography>
                                <List className="grid grid-cols-3 gap-3">
                                    {permissions.map((permission) => (
                                        <ListItem key={permission.id}>
                                            <Checkbox
                                                color="blue"
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                    className: "p-2",
                                                }}
                                                label={permission.name}
                                                value={permission.id}
                                                onChange={() => check(permission.id)}
                                            />
                                        </ListItem>
                                    ))}
                                </List>


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

export default CreateRole;