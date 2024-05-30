import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure, clearError} from "../redux/user/userSlice.js";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Profile() {
    const fileRef = useRef(null);
    const {currentUser, loading, error} = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);

    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        avatar: currentUser?.avatar || "",
        password: "",
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearError());
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        let simulatedProgress = 0;
        const intervalId = setInterval(() => {
            // Increment progress realistically, considering file size and network conditions
            const increment = Math.min(
                25, // Adjust based on desired speed and file size
                file.size * 0.01 // Simulate progress based on file size (optional)
            );
            simulatedProgress += increment;

            setFilePercentage(Math.min(simulatedProgress, 100)); // Clamp to 100 max

            if (simulatedProgress === 100) {
                clearInterval(intervalId);
                // Handle upload completion logic (e.g., get download URL)
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("downloadURL:", downloadURL);
                    setFormData((prevFormData) => ({ ...prevFormData, avatar: downloadURL }));
                });
            }
        }, 750);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await axios.post(`/api/user/update/${currentUser._id}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = res.data;
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                });
                return;
            }
            dispatch(updateUserSuccess(data));
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User updated successfully!',
            });
            setUpdateSuccess(true);
        } catch (e) {
            dispatch(updateUserFailure(e.message));
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update user!',
            });
        }
    };

    const handleDeleteUser = async () => {
        // Show confirmation dialog
        const confirmResult = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You are about to delete this user. This action cannot be undone!',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (!confirmResult.isConfirmed) {
            return; // User canceled the deletion
        }

        try {
            dispatch(deleteUserStart());
            const res = await axios.delete(`/api/user/delete/${currentUser._id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = res.data;
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                });
                return;
            }
            dispatch(deleteUserSuccess(data));
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User deleted successfully!',
            });
        } catch (e) {
            dispatch(deleteUserFailure(e.message));
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete user!',
            });
        }
    };

    const handleSignOut = async () => {
        // Show confirmation dialog
        const confirmResult = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'Do you want to sign out?',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, sign me out!',
        });

        if (!confirmResult.isConfirmed) {
            return; // User canceled the sign-out
        }

        try {
            dispatch(signOutStart());
            const res = await axios.post(`/api/auth/signout`, {}, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = res.data;
            if (data.success === false) {
                dispatch(signOutFailure(data.message));
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message,
                });
                return;
            }
            dispatch(signOutSuccess(data));
        } catch (e) {
            console.log("signout error : ",e.message)
            dispatch(signOutFailure(e.message));
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong!',
            });
        }
    };

    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await axios.get(`/api/user/listings/${currentUser._id}`);
            const data = res.data;
            if (data.success === false) {
                setShowListingsError(true);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch user listings!',
                });
                return;
            }
            setUserListings(data);
        } catch (e) {
            setShowListingsError(true);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch user listings!',
            });
        }
    };

    const handleListingDelete = async (listingId) => {
        // Show confirmation dialog
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this listing!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true
        });

        // If the user confirms deletion
        if (confirmResult.isConfirmed) {
            try {
                const res = await axios.delete(`/api/listing/delete/${listingId}`);
                const data = res.data;
                if (data.success === false) {
                    console.log(data.message);
                    await Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'Failed to delete listing!',
                    });
                    return;
                }
                setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Your listing has been deleted.',
                });
            } catch (e) {
                console.log(e.message);
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete listing!',
                });
            }
        }
    };


    return (
        <div className={'p-3 max-w-lg mx-auto'}>
            <h1 className={'text-3xl font-semibold text-center my-7'}>Profile</h1>

            <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type={'file'}
                    ref={fileRef}
                    hidden
                    accept={'image/*'}
                />

                <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar}
                    alt={'profile'}
                    className={'rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'}
                />

                <p className={'text-sm self-center'}>
                    {fileUploadError ? (
                        <span className={'text-red-700'}>Error Image Upload</span>
                    ) : filePercentage > 0 && filePercentage < 100 ? (
                        <span className={'text-slate-700'}>{`Uploading ${filePercentage}%`}</span>
                    ) : filePercentage === 100 ? (
                        <span className={'text-green-700'}>Image Successfully Uploaded!</span>
                    ) : (
                        ''
                    )}
                </p>

                <input
                    type={'text'}
                    placeholder={'username'}
                    id={'username'}
                    value={formData.username}
                    onChange={handleChange}
                    className={'border p-2 rounded-lg'}
                />

                <input
                    type={'email'}
                    placeholder={'email'}
                    id={'email'}
                    value={formData.email}
                    onChange={handleChange}
                    className={'border p-2 rounded-lg'}
                />

                <input
                    type={'password'}
                    placeholder={'password'}
                    id={'password'}
                    value={formData.password || ""}
                    onChange={handleChange}
                    className={'border p-2 rounded-lg'}
                />

                <button
                    disabled={loading}
                    className={'bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'}>
                    {loading ? "Loading..." : "Update"}
                </button>

                <Link
                    className={'bg-green-700 text-center text-white p-2 rounded-lg uppercase hover:opacity-95'}
                    to={'/create-listing'}>
                    Create Listing
                </Link>
            </form>

            <div className={'flex justify-between mt-5'}>
                <span onClick={handleDeleteUser} className={'text-red-700 cursor-pointer'}>Delete Account</span>
                <span onClick={handleSignOut} className={'text-red-700 cursor-pointer'}>Sign Out</span>
            </div>

            {error && <p className={'text-red-500'}>{error}</p>}
            <p className='text-green-700 mt-5'>{updateSuccess ? 'Profile updated successfully!' : ''}</p>

            <button
                onClick={handleShowListings}
                className={'text-green-700 w-full'}>
                Show Listings
            </button>
            <p className={'text-red-700 mt-5'}>{showListingsError ? 'Error showing listings' : ''}</p>

            {userListings && userListings.length > 0 &&
                <div className={'flex flex-col gap-4'}>
                    <h1 className={'text-2xl font-semibold text-center mt-7'}>Your Listings</h1>
                    {userListings.map((listing) => (

                <div key={listing._id} className={'border rounded-lg p-2 flex justify-between items-center gap-4'}>
                    <Link to={`/listing/${listing._id}`}>
                        <img src={listing.imageUrls[0]} alt={listing.name} className={'h-16 w-16 object-contain'} />
                    </Link>
                    <Link to={`/listing/${listing._id}`}
                          className={'text-slate-700 font-semibold flex-1 hover:underline truncate'}>
                        <p>{listing.name}</p>
                    </Link>

                    <div className={'flex flex-col items-center'}>
                        <button onClick={()=> handleListingDelete(listing._id)} className={'text-red-700 uppercase'}>Delete</button>

                        <Link to={`/update-listing/${listing._id}`}>
                            <button className={'text-green-700 uppercase'}>Edit</button>
                        </Link>

                    </div>
                </div>
            ))}
                </div>
            }
        </div>
    );
}
