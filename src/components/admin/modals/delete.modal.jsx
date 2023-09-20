import React from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";

export function NotificationDeleteDialog({ open, handleOpenDelete, handleConfirmDelete }) {
    return (
        <>
            <Dialog open={open} handler={handleOpenDelete} className="bg-slate-900">
                <DialogBody className="">
                    <div className="flex justify-end">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="mr-3 h-5 w-5 text-white"
                            onClick={handleOpenDelete}
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <div className="grid place-content-center gap-4">
                        <div className="flex justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-16 w-16 text-red-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>

                        <Typography color="white" variant="h4">
                            Are you sure you want to delete?
                        </Typography>
                    </div>
                </DialogBody>
                <DialogFooter className="space-x-2 flex justify-center">
                    <Button variant="filled" color="red" onClick={handleConfirmDelete}>
                        Yes, i'm sure
                    </Button>
                    <Button variant="outlined" color="white" onClick={handleOpenDelete}>
                        No, cancel
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}