import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function Contact({listing}) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const response = await fetch(`/api/user/${listing.userRef}`);
                const data = await response.json();
                if (data.success === false) {
                    return;
                }
                setLandlord(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchLandlord().then(r => console.log(r));
    }, [listing.userRef]);


    const onChange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <>
            {landlord && (
                <div className='flex flex-col items-center justify-center my-7'>
                    <p>Contact <span className={'font-semibold'}>{landlord.username}</span> for <span className={'font-semibold'}>{listing.name.toLowerCase()}</span></p>

                    <textarea
                        name={'message'}
                        id={'message'}
                        rows={2}
                        value={message}
                        onChange={onChange}
                        placeholder={'Enter your message here...'}
                        className={'w-full p-2 border rounded-lg'}>
                    </textarea>

                    <Link
                        className={'mt-2 bg-slate-700 text-white text-center p-2 uppercase rounded-lg hover:opacity-95'}
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    )
}