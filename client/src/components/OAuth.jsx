import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import {app} from "../firebase.js";
import {useDispatch} from "react-redux";
import {signInSuccess} from "../redux/user/userSlice.js";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const response = await axios.post('/api/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = response.data;
            dispatch(signInSuccess(data));
            navigate('/home')
        }catch (error) {
            let errorMessage = 'An unexpected error occurred.';
            if (error.response) {
                // Server responded with a status other than 200 range
                errorMessage = error.response.data.message || `Error: ${error.response.status}`;
            } else if (error.request) {
                // Request was made but no response was received
                errorMessage = 'No response received from the server. Please try again.';
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message;
            }
            console.error('Error details:', error);
        }
    }

  return (
    <button
        onClick={handleGoogleClick}
        type={'button'}
        className={'bg-red-700 text-white p-2 rounded-lg uppercase hover:opacity-95'}>
      Continue with Google
    </button>
  );
}