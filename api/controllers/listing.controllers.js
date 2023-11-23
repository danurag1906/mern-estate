import Listing from "../models/listing.models.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
    //201 means something is created
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(201).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update yourn own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6; //req.query is coming from the url of client side
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      //undefined when we search from the search bar and false when we dont check the offer checkbox
      offer = { $in: [false, true] }; //if offer filter is not selected to true , then we want to diaply all the listings to the user which includes offer and doesnt include offers. ($in) means search in the database
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let solar = req.query.solar;
    if (solar === undefined || solar === "false") {
      solar = { $in: [false, true] };
    }

    let pets = req.query.pets;
    if (pets === undefined || pets === "false") {
      pets = { $in: [false, true] };
    }

    let appartment = req.query.appartment;
    if (appartment === undefined || appartment === "false") {
      appartment = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      //all represents both  'rent' and 'sale'
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || ""; //get the search term from the search bar

    const sort = req.query.sort || "createdAt"; //sort it as per the req or by default sort by createdAt  (the latest one)

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, //regex is to search if searchTerm is present or not everywhere in the 'name' and 'i' means dont care about lower case or upper case
      offer,
      furnished,
      parking,
      solar,
      pets,
      appartment,
      type,
    })
      .sort(
        { [sort]: order } //inside this function, sort will act as key and order will act as value (value can be 'asc' or 'desc')(sort can be price, latest,oldest etc)
      )
      .limit(limit)
      .skip(startIndex); //limit as the name suggests, we can limit the no of results and skip is used for pagination feature, you can skip starting few results to acheive pagination functionality.
    // console.log(listings);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.body.userRef;
    const listingId = req.params.id;

    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Check if the user has already added the listing to the wishlist
    if (listing.wishlistUsers.includes(userId)) {
      return next(errorHandler(400, "Listing is already in your wishlist!"));
    }

    // Add the user to the wishlistUsers array
    listing.wishlistUsers.push(userId);
    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing added to wishlist successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlistItems = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find all listings in the wishlist for the user
    const wishlistItems = await Listing.find({ wishlistUsers: userId });

    res.status(200).json(wishlistItems);
  } catch (error) {
    next(error);
  }
};

//extra feature by me
export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const listingId = req.params.id;

    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    // Check if the user has added the listing to the wishlist

    // console.log(listing.wishlistUsers);

    if (!listing.wishlistUsers.includes(userId)) {
      return next(errorHandler(400, "Listing is not in your wishlist!"));
    }

    // Remove the user from the wishlistUsers array
    const index = listing.wishlistUsers.indexOf(userId);
    listing.wishlistUsers.splice(index, 1);
    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing removed from wishlist successfully!",
    });
  } catch (error) {
    next(error);
  }
};
