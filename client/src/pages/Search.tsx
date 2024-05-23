import {useEffect, useState} from "react";
import { useNavigate} from "react-router-dom";
import ListingItem from "../components/ListingItem.tsx";

export default function Search() {
    const navigate = useNavigate();

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    })

    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);

    console.log("listings : ", listings);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        const searchTerm = urlParams.get('searchTerm');
        const type = urlParams.get('type');
        const parking = urlParams.get('parking');
        const furnished = urlParams.get('furnished');
        const offer = urlParams.get('offer');
        const sort = urlParams.get('sort');
        const order = urlParams.get('order');

        if(searchTerm || type || parking || furnished || offer || sort || order){
            setSidebarData(
                {
                    searchTerm: searchTerm || '',
                    type: type || 'all',
                    parking: parking === 'true',
                    furnished: furnished === 'true',
                    offer: offer === 'true',
                    sort: sort || 'created_at',
                    order: order || 'desc',
                }
            )
        }

        //we can not use async function in useEffect, so we will create an async function and call it inside useEffect
            const fetchListings = async () => {
                setLoading(true);
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/listing/get?${searchQuery}`);
                const data = await res.json();
                setListings(data);
                setLoading(false);

            }
            fetchListings().then(r => console.log());
        }, [location.search]);

    const handleChange = (e: any) => {
        e.preventDefault();
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebarData({...sidebarData, type: e.target.id})
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebarData({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === 'true'})
        }
        if(e.target.id === 'searchTerm') {
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }
        if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({...sidebarData, sort, order})
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', String(sidebarData.parking));
        urlParams.set('furnished', String(sidebarData.furnished));
        urlParams.set('offer', String(sidebarData.offer));
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);
    }

    return (
        <div className={'flex flex-col md:flex-row'}>
            <div className={'p-7 border-b-2 md:border-r-2 md:min-h-screen'}>
                <form
                    onSubmit={handleSubmit}
                    className={'flex flex-col gap-8'}>
                    <div className={'flex items-center gap-2'}>
                        <label className={'whitespace-nowrap font-semibold'}>Search Term : </label>
                        <input
                            type="text"
                            placeholder="Search"
                            id={'searchTerm'}
                            className={'border rounded-lg p-2 w-full'}
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={'flex gap-2 flex-wrap items-center'}>
                        <label className={'font-semibold'}>Type : </label>
                        <div className={'flex gap-2'}>
                            <input type="checkbox" id={'all'} className={'w-5'} onChange={handleChange} checked={sidebarData.type === 'all'}/>
                            <span>Rent & Sale</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type="checkbox" id={'rent'} className={'w-5'} onChange={handleChange} checked={sidebarData.type === 'rent'}/>
                            <span>Rent</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type="checkbox" id={'sale'} className={'w-5'} onChange={handleChange} checked={sidebarData.type === 'sale'}/>
                            <span>Sale</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type="checkbox" id={'offer'} className={'w-5'} onChange={handleChange} checked={sidebarData.offer}/>
                            <span>Offer</span>
                        </div>

                    </div>
                    <div className={'flex gap-2 flex-wrap items-center'}>
                        <label className={'font-semibold'}>Amenities : </label>
                        <div className={'flex gap-2'}>
                            <input type="checkbox" id={'parking'} className={'w-5'} onChange={handleChange} checked={sidebarData.parking}/>
                            <span>Parking</span>
                        </div>
                        <div className={'flex gap-2'}>
                            <input type="checkbox" id={'furnished'} className={'w-5'} onChange={handleChange} checked={sidebarData.furnished}/>
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div className={'flex items-center gap-2'}>
                        <label className={'font-semibold'}>Sort : </label>
                        <select
                            id={'sort_order'}
                            className={'border rounded-lg p-2'}
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                        >
                            <option value={'regularPrice_desc'}>Price high to low</option>
                            <option value={'regularPrice_asc'}>Price low to high</option>
                            <option value={'createdAt_desc'}>Latest</option>
                            <option value={'createdAt_asc'}>Oldest</option>
                        </select>
                    </div>

                    <button className={'bg-slate-700 p-2 rounded-lg text-white uppercase hover:opacity-95'}>
                        Search
                    </button>

                </form>
            </div>

            {/*////////////////////////////////////////////*/}
            <div className={'flex-1'}>
                <h1 className={'text-3xl font-semibold border-b p-3 text-slate-700 mt-5'}>Listing Results : </h1>

                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    )}

                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing}/>
                        ))}
                </div>
            </div>
        </div>
    )
}