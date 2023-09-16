import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
    Input,
    Button
} from "@material-tailwind/react";
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import http from '@/services/Api';
import AdminWrapper from '@/components/admin/AdminWrapper';

const updateProfile = (props) => {
    const router = useRouter();

    // * Fetch the address
    const [errorAddress, setErrorAddress] = useState('');

    const [street, setStreet] = useState('');
    const [country, setCountry] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        (
            async () => {
                try {
                    const { data } = await http.get('/address/user');

                    // setFetchAddress(data.id);
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
                        <form onSubmit={updateAddress}>
                            <div className='flex flex-col md:flex-row justify-between'>

                                <div className='w-full md:w-2/4 md:mr-8' >
                                    <div className='mb-6'>
                                        <Input
                                            label="Street"
                                            defaultValue={street}
                                            onChange={(e) => setStreet(e.target.value)}
                                        />
                                    </div>
                                    <div className='mb-6'>
                                        <Input
                                            label="Country"
                                            defaultValue={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        />
                                    </div>
                                    <div className='mb-6'>
                                        <Input
                                            label="Province"
                                            defaultValue={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='w-full md:w-2/4 md:mr-8' >
                                    <div className='mb-6'>
                                        <Input
                                            label="City"
                                            defaultValue={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </div>
                                    <div className='mb-6'>
                                        <Input
                                            label="Zip Code"
                                            defaultValue={zip}
                                            onChange={(e) => setZip(e.target.value)}
                                        />
                                    </div>
                                    <div className='mb-6'>
                                        <Input
                                            label="Phone"
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
                    </div>

                </div>

            </div>

        </AdminWrapper >
    )
}

export default updateProfile