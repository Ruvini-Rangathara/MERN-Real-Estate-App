import React from "react";
import {Link, useNavigate} from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({});
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            setLoading(false)
            setError(null);
            navigate('/sign-in')
        }catch (e) {
            setLoading(false);
            setError(error.message);
        }
    }

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
