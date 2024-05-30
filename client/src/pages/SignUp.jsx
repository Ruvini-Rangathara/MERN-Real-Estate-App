import React from "react";
import {Link, useNavigate} from "react-router-dom";
import OAuth from "../components/OAuth.jsx";
import axios from 'axios';
import Swal from 'sweetalert2';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({});
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post('/api/auth/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (data.success === false) {
                setError(data.message);
                await Swal.fire({
                    icon: 'error',
                    title: 'Sign Up Failed',
                    text: data.message,
                });
                setLoading(false);
                return;
            }
            setLoading(false);
            setError(null);
            await Swal.fire({
                icon: 'success',
                title: 'Sign Up Successful',
                text: 'You have successfully signed up. Please sign in.',
            });
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(error.message);
            await Swal.fire({
                icon: 'error',
                title: 'Sign Up Error',
                text: error.message,
            });
        }
    };

    return (
        <div className={'p-3 max-w-lg mx-auto'}>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

            <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
                <input type='text' placeholder='username'
                       className='border p-2 rounded-lg' id='username'
                       onChange={handleChange}/>

                <input type='email' placeholder='email'
                       className='border p-2 rounded-lg' id='email'
                       onChange={handleChange}/>

                <input type='password' placeholder='password'
                       className='border p-2 rounded-lg' id='password'
                       onChange={handleChange}/>

                <button disabled={loading}
                        className={'bg-slate-700 text-white p-2 rounded-lg uppercase hover:opacity-80'}>
                        {loading ? 'Loading...' : 'Sign Up'}
                </button>

                <OAuth />
            </form>

            <div className={'flex gap-2 mt-5'}>
                <p>Have an account? </p>
                <Link to={'/sign-in'}>
                    <span className={'text-blue-700'}>Sign In</span>
                </Link>
            </div>
            {error && <p className={'text-red-500'}>{'Please check your submission!'}</p>}
        </div>
    );
}
