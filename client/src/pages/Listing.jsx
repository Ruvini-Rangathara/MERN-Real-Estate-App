import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import "swiper/css/bundle";
import {FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair, FaPaypal, FaCcVisa} from "react-icons/fa";
import {useSelector} from "react-redux";
import Contact from "../components/Contact.jsx";
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const currentUser = useSelector((state) => state.user);

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/listing/get/${params.listingId}`);
                const data = response.data;
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    await Swal.fire({
                        icon: 'error',
                        title: 'Fetch Listing Failed',
                        text: data.message,
                    });
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
                await Swal.fire({
                    icon: 'error',
                    title: 'Fetch Listing Error',
                    text: error.message,
                });
            }
        };
        fetchListing().then(r => console.log());
    }, [params.listingId]);


    const navigate = useNavigate();

    const handlePayNow = () => {
        navigate(`/payment`, { state: { listing } });
    };

    return (
        <main className={'mb-6'}>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && (
                <p className='text-center my-7 text-2xl'>Something went wrong!</p>
            )}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className='h-[550px]'
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className={'fixed top-[13%] right-[3%] z-10 border rounded-full w-8 h-8 flex justify-center items-center bg-slate-100 cursor-pointer'}>
                        <FaShare className={'text-slate-500'}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href).then(r => console.log(r));
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && ( <p className={'fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-1'}>Link Copied!</p>)}

                    <div className={'px-4 md:px-10 flex flex-col max-w-4xl mx-auto my-6 gap-2'}>
                            <p className={'text-xl font-semibold'}>
                                {listing.name} - ${" "}
                                {listing.price ?
                                    listing.discountPrice.toLocaleString('en-US') :
                                    listing.regularPrice.toLocaleString('en-US')
                                }
                                {listing.type === 'rent' ? '/month' : ''}
                            </p>
                            <p className={'flex items-center mt-2 gap2 text-slate-600 text-sm'}>
                                <FaMapMarkerAlt className={'text-green-700'}/>
                                {listing.address}
                            </p>

                            <div className={'flex gap-4'}>
                                <p className={'bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'}>
                                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                                </p>
                                {
                                    listing.offer && (
                                        <p className={'bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'}>
                                            ${+listing.regularPrice - +listing.discountPrice} OFF
                                        </p>
                                    )
                                }
                            </div>
                            <p className={'text-slate-800'}><span
                                className={'font-semibold text-black'}>Description - {' '} </span>{listing.description}
                            </p>

                            <ul className={' text-green-900 font-semibold text-sm flex items-center gap-4 sm:gap-6 flex-wrap'}>
                                <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                    <FaBed className={'text-lg'}/>
                                    {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                                </li>
                                <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                    <FaBath className={'text-lg'}/>
                                    {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                                </li>
                                <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                    <FaParking className={'text-lg'}/>
                                    {listing.parking ? 'Parking spot' : 'No Parking'}
                                </li>
                                <li className={'flex items-center gap-1 whitespace-nowrap'}>
                                    <FaChair className={'text-lg'}/>
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                            </ul>

                            <div className={'flex justify-center sm:justify-between flex-wrap w-full'}>
                                {currentUser && listing.userRef !== currentUser._id && !contact && (
                                    <button
                                        onClick={() => setContact(true)}
                                        className={' mt-6 sm:text-xs sm:px-4 px-20 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-1'}>
                                        Contact Landlord
                                    </button>
                                )}
                                {contact && <Contact listing={listing}/>}

                                <button
                                    onClick={handlePayNow}
                                    className={' mt-6 p-1 flex text-sm justify-center items-center w-28 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-700 hover:text-white disabled:opacity-50 '}>
                                    <FaCcVisa className={'mr-2 text-lg'}/>
                                    Pay Now
                                </button>
                            </div>

                        </div>
                </div>
            )}
        </main>
    )
}