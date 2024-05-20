import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutStart, signOutSuccess, signOutFailure, clearError} from "../redux/user/userSlice.js";
import {useDispatch} from "react-redux";

export default function Profile() {
    const fileRef = useRef(null);
    const {currentUser, loading, error} = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

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
        try{
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        }catch (e){
            dispatch(updateUserFailure(e.message));
        }
    };

    const handleDeleteUser = async () => {
        try{
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return
            }
            dispatch(deleteUserSuccess(data));
        }catch (e){
            dispatch(deleteUserFailure(e.message));
        }
    };

    const handleSignOut = async () => {
        try{
            dispatch(signOutStart());
            const res = await fetch(`/api/auth/signout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutFailure(data.message));
                return;
            }
            dispatch(signOutSuccess(data));
        }catch (e){
            dispatch(signOutFailure(e.message));
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
            </form>

            <div className={'flex justify-between mt-5'}>
                <span onClick={handleDeleteUser} className={'text-red-700 cursor-pointer'}>Delete Account</span>
                <span onClick={handleSignOut} className={'text-red-700 cursor-pointer'}>Sign Out</span>
            </div>

            {error && <p className={'text-red-500'}>{error}</p>}
            <p className='text-green-700 mt-5'>{updateSuccess ? 'Profile updated successfully!' : ''}</p>
        </div>
    );
}
