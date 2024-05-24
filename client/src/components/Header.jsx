import React, {useEffect, useState} from "react";
import {FaSearch} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

export default function Header() {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (currentUser) {
            console.log("User avatar link:", currentUser.avatar);
        }
    }, [currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        setSearchTerm(searchTermFromUrl || '');
    }, [location.search]);

    return (
        <header className={'bg-slate-200 shadow-md'}>
            <div className={'flex justify-between items-center max-w-6xl mx-auto p-2'}>
                <Link to={'/home'}>
                    <h1 className={'font-bold text-sm sm:text-xl flex flex-wrap'}>
                        <span className={'text-slate-500'}>Dream</span>
                        <span className={'text-slate-700'}>Home</span>
                    </h1>
                </Link>
                <form
                    className={'bg-slate-100 p-2 rounded-lg flex item-center'}
                    onSubmit={handleSubmit}
                >
                    <input type={'text'}
                           placeholder={'Search..'}
                           className={'bg-transparent focus:outline-none w-24 sm:w-64'}
                           onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className={'text-slate-500'}/>
                    </button>
                </form>

                <ul className={'flex gap-4'}>
                    <Link to={'/home'}>
                        <li className={'hidden sm:inline text-slate-600 hover:underline'}>Home</li>
                    </Link>
                    <Link to={'/about'}>
                        <li className={'hidden sm:inline text-slate-600 hover:underline'}>About</li>
                    </Link>

                    <Link to={'/profile'}>
                        {currentUser ? (
                            <img
                                className={'w-8 h-8 rounded-full object-cover'}
                                src={currentUser.avatar}
                                alt={'profile'}
                                // onError={(e) => e.currentTarget.src = 'client/public/profile.png'}
                            />
                        ): (
                            <li className={'sm:inline text-slate-600 hover:underline'}>Sign In</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
}