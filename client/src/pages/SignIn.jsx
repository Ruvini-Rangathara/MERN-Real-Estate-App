import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = React.useState({});

    // const [error, setError] = React.useState(null);
    // const [loading, setLoading] = React.useState(false);

    const {error, loading} = useSelector(state => state.user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            // setLoading(true);
            dispatch(signInStart());

            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success === false) {
                // setError(data.message);
                // setLoading(false);

                dispatch(signInFailure(data.message));
                return;
            }
            // setLoading(false)
            // setError(null);

            dispatch(signInSuccess(data));
            navigate('/home')
        }catch (e) {
            // setLoading(false);
            // setError(error.message);

            dispatch(signInFailure(e.message));
        }
    }

    return (
        <div className={'p-3 max-w-lg mx-auto'}>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

            <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>

                <input type='email' placeholder='email'
                       className='border p-2 rounded-lg' id='email'
                       onChange={handleChange}/>

                <input type='password' placeholder='password'
                       className='border p-2 rounded-lg' id='password'
                       onChange={handleChange}/>

                <button disabled={loading}
                        className={'bg-slate-700 text-white p-2 rounded-lg uppercase hover:opacity-80'}>
                    {loading ? 'Loading...' : 'Sign In'}
                </button>
                <OAuth />
            </form>

            <div className={'flex gap-2 mt-5'}>
                <p>Don't have an account? </p>
                <Link to={'/sign-up'}>
                    <span className={'text-blue-700'}>Sign Up</span>
                </Link>
            </div>
            {error && <p className={'text-red-500'}>{error}</p>}
        </div>
    );
}
