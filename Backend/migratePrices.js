import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Define a loose schema so Mongoose doesn't cast `price` to Number immediately
const listingSchema = new mongoose.Schema({}, { strict: false });
const Listing = mongoose.model("ListingRaw", listingSchema, "listings");

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const listings = await Listing.find().lean();
    let updatedCount = 0;

    for (const listing of listings) {
      let needsUpdate = false;
      let newPrice = listing.price;
      let newTimespan = listing.timespan;

      // Check if price is a string like "5000/month"
      if (typeof listing.price === "string" && listing.price.includes("/")) {
        const parts = listing.price.split("/");
        newPrice = Number(parts[0]);
        newTimespan = parts[1].toLowerCase().trim();
        needsUpdate = true;
      } 
      // Or maybe price is a string number but timespan is missing
      else if (typeof listing.price === "string") {
        newPrice = Number(listing.price);
        if (!newTimespan) {
            newTimespan = "month"; // default
        }
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`Updating listing ${listing._id}: ${listing.price} -> price: ${newPrice}, timespan: ${newTimespan}`);
        await Listing.updateOne(
          { _id: listing._id },
          { $set: { price: newPrice, timespan: newTimespan } }
        );
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} listings.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
