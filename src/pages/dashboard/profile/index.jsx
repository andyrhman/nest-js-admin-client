import React, { useState, useEffect } from 'react';
import {
    Input,
    Typography,
    Button,
    Alert,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// * Components
import http from '@/services/Api';
import AdminWrapper from '@/components/admin/AdminWrapper';
import { setUser } from '@/redux/actions/setUserAction';
import { connect } from 'react-redux';

function Icon({ id, open }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
};

const profile = (props) => {

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
                    setUsername(props.user.username);
                    setEmail(props.user.email);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        setError('An error occurred');
                        router.push('/login');
                    }
                }
            }
        )();
    }, [props.user]);

    const infoSubmit = async (e) => {
        e.preventDefault();
        setEmailError(false);
        setUsernameError(false);
        setError('');

        try {
            const { data } = await http.put('/users/info', {
                username,
                email
            });

            props.setUser({
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role || {}
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
            }, 1000);

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

    // * Accordion
    const [open, setOpen] = useState(0);
    const [alwaysOpen, setAlwaysOpen] = useState(true);

    const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    // * Open Address
    const [openAddress, setOpenAddress] = useState(false);

    const handleClick = () => {
        setOpenAddress(current => !current);
    };

    // * Create Address
    const [street, setStreet] = useState('');
    const [country, setCountry] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [phone, setPhone] = useState('');

    const createAddress = async (e) => {
        e.preventDefault();

        try {
            await http.post('/address', {
                street,
                country,
                province,
                city,
                zip,
                phone,
            })
            // Show a success message using React Toastify
            toast.success('Address Created Successfully!.', {
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
            }, 1000);

        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
        }
    }

    // * Fetch the address
    const [errorAddress, setErrorAddress] = useState('');

    const [fetchAddress, setFetchAddress] = useState('');

    useEffect(() => {
        (
            async () => {
                try {
                    const { data } = await http.get('/address/user');

                    setFetchAddress(data.id);
                    setStreet(data.street);
                    setCountry(data.country);
                    setProvince(data.province);
                    setCity(data.city);
                    setZip(data.zip);
                    setPhone(data.phone) // Convert string to number
                } catch (errorAddress) {
                    if (errorAddress.response && errorAddress.response.status === 404 && errorAddress.response.data.message) {
                        const errorMessage = errorAddress.response.data.message;
                        setErrorAddress(errorMessage);
                    }
                }

            }
        )();
    }, []);

    // * Update Address

    const updateAddress = async (e) => {
        e.preventDefault();

        try {
            await http.put('/address', {
                street,
                country,
                province,
                city,
                zip,
                phone,
            })
            // Show a success message using React Toastify
            toast.success('Address Created Successfully!.', {
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
            }, 1000);

        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
        }
    }

    return (
        <AdminWrapper>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded light bg-white" >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex w-full flex-col gap-2">

                        {error && (
                            <Alert color="red" className="mt-2 text-center font-normal">
                                {error}
                            </Alert>
                        )}

                        <Accordion open={alwaysOpen} icon={<Icon id={1} />} animate={CUSTOM_ANIMATION}>
                            <AccordionHeader onClick={handleAlwaysOpen}>My Address</AccordionHeader>
                            <AccordionBody>
                                {fetchAddress ? (
                                    <>
                                        <form onSubmit={updateAddress}>
                                            <div className='flex flex-col md:flex-row justify-between'>

                                                <div className='w-full md:w-2/4 md:mr-8' >
                                                    <div className='mb-6'>
                                                        <Input
                                                            label='Street'
                                                            defaultValue={street}
                                                            onChange={(e) => setStreet(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='mb-6'>
                                                        <Input
                                                            label='Country'
                                                            defaultValue={country}
                                                            onChange={(e) => setCountry(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='mb-6'>
                                                        <Input
                                                            label='Province'
                                                            defaultValue={province}
                                                            onChange={(e) => setProvince(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='w-full md:w-2/4 md:mr-8' >
                                                    <div className='mb-6'>
                                                        <Input
                                                            label='City'
                                                            defaultValue={city}
                                                            onChange={(e) => setCity(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='mb-6'>
                                                        <Input
                                                            label='Zip Code'
                                                            defaultValue={zip}
                                                            onChange={(e) => setZip(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className='mb-6'>
                                                        <Input
                                                            label='Phone'
                                                            defaultValue={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <Button type='submit' className="flex items-center gap-3" size="sm" color='blue' variant='filled'>
                                                <i className="fa-solid fa-floppy-disk" /> Submit
                                            </Button>

                                        </form>
                                    </>
                                ) : (
                                    <>
                                        {!openAddress && (

                                            <div className='grid place-content-center gap-4'>

                                                <Typography color="blue-gray" variant='h5'>
                                                    Address Not Found
                                                </Typography>

                                                <Button onClick={handleClick} color='blue' variant='filled'>
                                                    Create Address
                                                </Button>
                                            </div>

                                        )}

                                        {openAddress && (
                                            <form onSubmit={createAddress}>
                                                <div className='flex flex-col md:flex-row justify-between'>
                                                    <div className='w-full md:w-2/4 md:mr-8' >
                                                        <div className='mb-6'>
                                                            <Input
                                                                label="Street"
                                                                onChange={(e) => setStreet(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className='mb-6'>
                                                            <Input
                                                                label="Country"
                                                                onChange={(e) => setCountry(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className='mb-6'>
                                                            <Input
                                                                label="Province"
                                                                onChange={(e) => setProvince(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='w-full md:w-2/4 md:mr-8' >
                                                        <div className='mb-6'>
                                                            <Input
                                                                label="City"
                                                                onChange={(e) => setCity(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className='mb-6'>
                                                            <Input
                                                                type='number'
                                                                label="Zip Code"
                                                                onChange={(e) => setZip(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className='mb-6'>
                                                            <Input
                                                                type='number'
                                                                label="Phone"
                                                                onChange={(e) => setPhone(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button type='submit' className="flex items-center gap-3" size="sm" color='blue' variant='filled'>
                                                    <i className="fa-solid fa-floppy-disk" /> Submit
                                                </Button>
                                            </form>
                                        )}
                                    </>
                                )}



                            </AccordionBody>
                        </Accordion>
                        <Accordion open={open === 2} icon={<Icon id={2} />} animate={CUSTOM_ANIMATION}>
                            <AccordionHeader onClick={() => handleOpen(2)}>
                                Account Information
                            </AccordionHeader>
                            <AccordionBody>

                                <div className='flex flex-col md:flex-row justify-between'>
                                    <div className='w-full md:w-2/4 md:mr-8' >
                                        <form onSubmit={infoSubmit}>
                                            <Typography color="blue-gray" variant='h4'>
                                                Update Info
                                            </Typography>
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
                                            <div className='mt-2'>
                                                <Button type='submit' className="flex items-center gap-3" size="sm" color='blue' variant='filled'>
                                                    <i className="fa-solid fa-floppy-disk" /> Save
                                                </Button>
                                            </div>

                                        </form>
                                    </div>
                                    <div className='w-full md:w-2/4 md:mr-8' >
                                        <form onSubmit={passwordSubmit}>
                                            <Typography color="blue-gray" variant='h4'>
                                                Change Password
                                            </Typography>
                                            <Typography color="blue-gray" variant='small'>
                                                Password
                                            </Typography>
                                            <Input
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

                                            <Typography color="blue-gray" variant='small'>
                                                Confirm Password
                                            </Typography>

                                            <Input
                                                label="Confirm Password"
                                                type="password"
                                                required
                                                error={!!confirmPasswordError} // Pass the error state as a prop
                                                onChange={(e) => validateConfirmPassword(e.target.value)}

                                            />
                                            {confirmPasswordError && <div className="text-red-500 text-xs mt-1">{confirmPasswordError}</div>}

                                            <div className='mt-2'>
                                                <Button type='submit' className="flex items-center gap-3" size="sm" color='blue' variant='filled'>
                                                    <i className="fa-solid fa-floppy-disk" /> Save
                                                </Button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </AccordionBody>
                        </Accordion>

                    </div>

                </div>

            </div>

        </AdminWrapper >
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => dispatch(setUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(profile);