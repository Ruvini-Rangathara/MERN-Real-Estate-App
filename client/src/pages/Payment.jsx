import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ listing }) => {
    console.log("listing : ", listing)
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await fetch('/api/listing/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: listing.offer ? listing.discountPrice : listing.regularPrice,
            }),
        });

        const data = await response.json();

        const result = await stripe.confirmCardPayment(data.client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            setError(result.error.message);
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.error.message,
            });
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded');
                await Swal.fire({
                    icon: 'success',
                    title: 'Payment successful',
                    text: 'Thank you for your payment!',
                });
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form p-10 lg:w-1/2 mx-auto md:w-3/4 sm:w-full">
            <div className="flex flex-col mb-2">
                <h1 className="text-xl text-green-600 text-center mt-6 mb-8">{listing.name}</h1>
                <div className={'flex justify-between mt-2'}>
                    <p className="">Total Price : </p>
                    <p className="text-xl">
                        ${listing.offer ? listing.discountPrice : listing.regularPrice}
                        {listing.type === 'rent' ? '/month' : ''}
                    </p>
                </div>
            </div>

            <hr />

            <div className="flex flex-col space-y-4 mb-4 mt-8">
                <label htmlFor="cardholder-name">
                    Card Holder Name
                </label>
                <input
                    type="text"
                    id="cardholder-name"
                    placeholder="Full Name"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            <label htmlFor="card-number">
                Card Number
            </label>
            <CardElement
                className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <p className={'text-sm text-gray-400 mt-2'}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid architecto enim eos eum ex harum illo impedit inventore veniam!
            </p>

            <div className={'flex justify-between'}>
                <Link to={'/'}
                      className="text-red-400 text-center border rounded-lg border-red-400 hover:text-red-600 mt-6 w-20 p-1">
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center text-center mt-6 w-20 p-1 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={!stripe || loading}
                >
                    {loading ? 'Processing...' : 'Pay'}
                </button>
            </div>

            {error && <div>{error}</div>}
        </form>
    );
};

const Payment = () => {
    const location = useLocation();
    const { listing } = location.state || {};

    if (!listing) {
        return <p>No listing details available.</p>;
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm listing={listing} />
        </Elements>
    );
};

export default Payment;
