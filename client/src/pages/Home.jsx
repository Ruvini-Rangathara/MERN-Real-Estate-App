import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css/bundle';
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import ListingItem from "../components/ListingItem.jsx";

export default function Home() {
    const [offerListings, setOfferListings] = React.useState([]);
    const [saleListings, setSaleListings] = React.useState([]);
    const [rentListings, setRentListings] = React.useState([]);

    SwiperCore.use([Navigation]);

    useEffect(() => {
        const fetchOfferListings = async () => {
            try{
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings().then(r => console.log());
            }catch (e) {
                console.log(e)
            }
        }

        const fetchRentListings = async () => {
            try{
                const res = await fetch('/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                fetchSaleListings().then(r => console.log());
            }catch (e) {
                console.log(e)
            }
        }

        const fetchSaleListings = async () => {
            try{
                const res = await fetch('/api/listing/get?type=sale&limit=4');
                const data = await res.json();
                setSaleListings(data);
            }catch (e) {
                console.log(e)
            }
        }

        fetchOfferListings().then(r => console.log());
    }, []);

    return (
        <div>
        {/*    top*/}
            <div className={'flex flex-col gap-6 p-28 px-20 py-16 max-w-6xl '}>
                <h1 className={'text-slate-700 font-bold text-3xl lg:text-6xl'}>Find your next
                    <span className={'text-slate-500'}> perfect</span>
                    <br/>place with ease
                </h1>
                <div className={'text-gray-400 text-xs sm:text-sm'}>
                    Dream Home Real Estate is the best place to find your next perfect place to
                    live.
                    <br />
                    We have a wide range of properties for you to choose from.
                </div>
                <Link to={'/search'} className={'text-xs sm:text-sm text-blue-800 font-bold hover:underline'}>
                    Let's get started...
                </Link>
            </div>

            {/*swiper*/}
            <Swiper navigation>
                {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
                    <SwiperSlide  key={listing._id}>
                        <div
                            style={{
                                backgroundImage: `url(${listing.imageUrls[0]})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover'
                            }}
                            className={'h-[500px] mx-auto'}
                        >
                        </div>
                    </SwiperSlide>
                ))};
            </Swiper>

        {/*    listing results for offer, sale and rent*/}
            <div className={'max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10 '}>
                {/*///////////////////////////////////////////////////////////////////////*/}
                {offerListings && offerListings.length > 0 && (
                    <div className={''}>
                        <div className={'my-3'}>
                            <h2 className={'text-2xl font-semibold text-slate-600'}>Recent offers</h2>
                            <Link
                                className={'text-sm text-blue-800 hover:underline'}
                                to={'/search?offer=true'}>
                                Show more offers...
                            </Link>
                        </div>
                        <div className={'flex flex-wrap gap-4'}>
                            {
                                offerListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id}/>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/*///////////////////////////////////////////////////////////////////////*/}
                {rentListings && rentListings.length > 0 && (
                    <div className={''}>
                        <div className={'my-3'}>
                            <h2 className={'text-2xl font-semibold text-slate-600'}>Recent places for rent</h2>
                            <Link
                                className={'text-sm text-blue-800 hover:underline'}
                                to={'/search?type=rent'}>
                                Show more places...
                            </Link>
                        </div>
                        <div className={'flex flex-wrap gap-4'}>
                            {
                                rentListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id}/>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/*///////////////////////////////////////////////////////////////////////*/}
                {saleListings && saleListings.length > 0 && (
                    <div className={''}>
                        <div className={'my-3'}>
                            <h2 className={'text-2xl font-semibold text-slate-600'}>Recent places for sale</h2>
                            <Link
                                className={'text-sm text-blue-800 hover:underline'}
                                to={'/search?type=sale'}>
                                Show more places...
                            </Link>
                        </div>
                        <div className={'flex flex-wrap gap-4'}>
                            {
                                saleListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id}/>
                                ))
                            }
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}