import Listing from "../model/listing.model.js";
import {errorHandler} from "../util/error.js";
import dotenv from 'dotenv';

dotenv.config();

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createListing = async (req, res, next) => {
    try{
        const listing =  await Listing.create(req.body);
        res.status(201).json(listing);
    }catch (e) {
        console.error(e.message)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Listing not found"));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete your own listings"));
    }
    try{
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Listing deleted"});
    }catch (e) {
        console.error(e.message)
        next(e);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Listing not found"));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only update your own listings"));
    }
    try{
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updatedListing);
    }catch (e) {
        console.error(e.message)
        next(e);
    }
}

export const getListing = async (req, res, next) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found"));
        }
        res.status(200).json(listing);
    }catch (e) {
        console.error(e.message)
        next(e);
    }
}

export const getListings = async (req, res, next) => {
    try{
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer;
        if(offer === undefined || offer === 'false'){
            offer = {$in: [false, true]};
        }

        let furnished = req.query.furnished;
        if(furnished === undefined || furnished === 'false'){
            furnished = {$in: [false, true]};
        }

        let parking = req.query.parking;
        if(parking === undefined || parking === 'false'){
            parking = {$in: [false, true]};
        }

        let type = req.query.type;
        if(type === undefined || type === 'all'){
            type = {$in: ['sale', 'rent']};
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            $and: [
                {offer: offer},
                {furnished: furnished},
                {parking: parking},
                {type: type},
                {name: {$regex: searchTerm, $options: 'i'}}
            ]
        }).sort({[sort]: order})
            .limit(limit).skip(startIndex);

        return res.status(200).json(listings);
    }catch (e) {
        console.error(e.message)
        next(e);
    }
}

export const makePayment = async (req, res, next) => {
    console.log('Making payment in controller...')
    // make payment and if success show success message with Swal
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
        });

        res.status(200).json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Failed to create payment intent' });
    }
}