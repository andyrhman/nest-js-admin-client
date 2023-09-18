import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Alert,
    Typography,
    Textarea
} from "@material-tailwind/react";
import ImageUploads from "@/components/admin/uploads/ImageUploads";
import MultipleImageUploads from "@/components/admin/uploads/MultipleImagesUpload";
import { Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from "@/services/Api";

const CreateProducts = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [images, setImages] = useState([]); // additional images
    const [price, setPrice] = useState('');

    const [error, setError] = useState('');

    const addImages = (urls) => {
        setImages(prevImages => [...prevImages, ...urls]);
    }

    const submit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { data } = await http.post('/products', {
                title,
                description,
                image,
                images,
                price
            });
            if (data) {
                // Show a success message using React Toastify
                toast.success('Product Created Successfully!.', {
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
                    <DialogHeader>Create Products</DialogHeader>
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
                                    label="Title"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="mb-2">
                                <Textarea
                                    label="Description"
                                    required
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-5">
                                <Typography color="blue-gray" className="font-medium mb-2">
                                    Choose a image
                                </Typography>
                                <input
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                                <ImageUploads uploaded={setImage} />
                            </div>

                            <div className="mb-5">
                                <Typography color="blue-gray" className="font-medium mb-2">
                                    Choose multiple images
                                </Typography>
                                <MultipleImageUploads uploaded={addImages} />
                                <textarea
                                    value={images.join('\n')}
                                    onChange={(e) => setImages(e.target.value)}
                                    readOnly
                                />
                            </div>

                            <div className="mb-5">
                                <Input
                                    label="Price"
                                    type="number"
                                    required
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                        </div>
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                        <Button variant="outlined" color="red" onClick={onClose}>
                            Close
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

export default CreateProducts;