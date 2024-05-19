// import React, {useState, useRef, useEffect} from "react";
// import {useSelector} from "react-redux";
// import {getDownloadURL ,getStorage, ref, uploadBytesResumable} from "firebase/storage";
// import {app} from "../firebase.js";
//
// export default function Profile() {
//     const fileRef  = useRef(null);
//     const currentUser = useSelector((state: any) => state.user.currentUser);
//     const [file, setFile] = useState(undefined);
//     const [filePercentage, setFilePercentage] = useState(0);
//     const [fileUploadError, setFileUploadError] = useState(false);
//     // const [formData, setFormData] = useState({});
//
//     const [formData, setFormData] = useState({
//         username: currentUser?.username || "",
//         email: currentUser?.email || "",
//         avatar: currentUser?.avatar || "",
//     });
//
//     console.log("file : ", file)
//     console.log("file percentage : ", filePercentage)
//     console.log("file upload error : ", fileUploadError)
//
//     useEffect(() => {
//         if (file) {
//             handleFileUpload(file);
//         }
//     }, [file]);
//
//     const handleFileUpload =  (file) => {
//         const storage = getStorage(app);
//         const fileName = new Date().getTime() + file.name;
//         const storageRef = ref(storage, fileName);
//         const uploadTask = uploadBytesResumable(storageRef, file);
//
//         uploadTask.on('state_changed',
//             (snapshot) => {
//                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                console.log('Upload is ' + progress + '% done');
//                setFilePercentage(Math.round(progress));
//         },
//         (error) => {
//             console.log("error : ", error)
//             setFileUploadError(true);
//         },
//         ()=> {
//             // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
//             //     setFormData({...formData, avatar: downloadURL})
//             // );
//             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                 setFormData((prevFormData) => ({ ...prevFormData, avatar: downloadURL }));
//                 setFilePercentage(100);
//             });
//         }
//         );
//     };
//
//     //firebase storage
//     // allow read;
//     // allow write: if
//     //     request.resource.size < 2*1024*1024 &&
//     //     request.resource.contentType.matches('image/.*');
//
//     return (
//         <div className={'p-3 max-w-lg mx-auto'}>
//             <h1 className={'text-3xl font-semibold text-center my-7'}>Profile</h1>
//
//             <form className={'flex flex-col gap-4'}>
//                 <input
//                     onChange={(e) => setFile(e.target.files[0])}
//                     type={'file'} ref={fileRef} hidden accept={'image/*'}/>
//
//                 <img
//                      onClick={() => fileRef.current.click()}
//                      src={currentUser.avatar || formData.avatar} alt={'profile'}
//                      className={'rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'}/>
//
//                 <p className={'text-sm self-center'}>
//                     {fileUploadError ? (
//                         <span className={'text-red-700'}>Error Image Upload</span>
//                     ) : filePercentage > 0 && filePercentage < 100 ? (
//                         <span className={'text-slate-700'}>{`Uploading ${filePercentage}%`}</span>
//                     ) :  filePercentage === 100 ? (
//                         <span className={'text-green-700'}>Image Successfully Uploaded!</span>
//                     ) : (
//                         ''
//                     )}
//                 </p>
//
//                 <input type={'text'} placeholder={'username'}
//                        id={'username'} className={'border p-2 rounded-lg'}/>
//
//                 <input type={'email'} placeholder={'email'}
//                        id={'email'} className={'border p-2 rounded-lg'}/>
//
//                 <input type={'text'} placeholder={'password'}
//                        id={'password'} className={'border p-2 rounded-lg'}/>
//
//                 <button className={'bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'}>Update</button>
//             </form>
//
//             <div className={'flex justify-between mt-5'}>
//                 <span className={'text-red-700 cursor-pointer'}>Delete Account</span>
//                 <span className={'text-red-700 cursor-pointer'}>Sign Out</span>
//             </div>
//
//         </div>
//     );
// }



import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";

export default function Profile() {
    const fileRef = useRef(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [file, setFile] = useState(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);

    const [formData, setFormData] = useState({
        username: currentUser?.username || "",
        email: currentUser?.email || "",
        avatar: currentUser?.avatar || "",
        password: "",
    });

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // uploadTask.on(
        //     'state_changed',
        //     (snapshot) => {
        //         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //         console.log('Upload is ' + progress + '% done');
        //         setFilePercentage(Math.floor(progress));
        //     },
        //     (error) => {
        //         console.log("error : ", error);
        //         setFileUploadError(true);
        //     },
        //     () => {
        //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //             console.log("downloadURL : ", downloadURL);
        //             setFormData((prevFormData) => ({ ...prevFormData, avatar: downloadURL }));
        //             setFilePercentage(100);
        //         });
        //     }
        // );


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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form data:", formData);
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

                <button className={'bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'}>Update</button>
            </form>

            <div className={'flex justify-between mt-5'}>
                <span className={'text-red-700 cursor-pointer'}>Delete Account</span>
                <span className={'text-red-700 cursor-pointer'}>Sign Out</span>
            </div>
        </div>
    );
}
