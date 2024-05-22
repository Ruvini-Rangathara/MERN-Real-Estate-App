import Listing from "../model/listing.model.js";
import {errorHandler} from "../util/error.js";

export const createListing = async (req, res, next) => {
    try{
        const listing =  await Listing.create(req.body);
        res.status(201).json(listing);
    }catch (e) {

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
        next(e);
    }
}