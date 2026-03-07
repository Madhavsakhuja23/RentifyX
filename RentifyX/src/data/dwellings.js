import listing1 from "../assets/listing-1.avif";
import listing2 from "../assets/listing-2.avif";
import listing3 from "../assets/listing-3.avif";
import listing4 from "../assets/listing-4.avif";
import listing5 from "../assets/listing-5.avif";
import listing6 from "../assets/listing-6.avif";
import listing11 from "../assets/listing-1.1.png";
import listing12 from "../assets/listing-1.2.png";
import listing13 from "../assets/listing-1.3.png";
import listing14 from "../assets/listing-1.4.png";
import listing21 from "../assets/listing-2.1.png";
import listing22 from "../assets/listing-2.2.png";
import listing23 from "../assets/listing-2.3.png";
import listing24 from "../assets/listing-2.4.png";
import listing31 from "../assets/listing-3.1.png";
import listing32 from "../assets/listing-3.2.png";
import listing33 from "../assets/listing-3.3.png";
import listing34 from "../assets/listing-3.4.png";
import listing41 from "../assets/listing-4.1.png";
import listing42 from "../assets/listing-4.2.png";
import listing43 from "../assets/listing-4.3.png";
import listing44 from "../assets/listing-4.4.png";
import listing51 from "../assets/listing-5.1.png";
import listing52 from "../assets/listing-5.2.png";
import listing53 from "../assets/listing-5.3.png";
import listing54 from "../assets/listing-5.4.png";
import listing61 from "../assets/listing-6.1.png";
import listing62 from "../assets/listing-6.2.png";
import listing63 from "../assets/listing-6.3.png";
import listing64 from "../assets/listing-6.4.png";


export const categoryLabels = {
  villa: "Villas",
  flats: "Flats",
  pgs: "PGs / Hostels",
  travel: "Travel Stays",
};

export const pricingRules = {
  houses: "Min. 6 months",
  flats: "Min. 1 month",
  pgs: "Min. 1 month",
  travel: "Hourly basis",
};

export const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Goa",
  "Jaipur",
];

export const listings = [
{
id: "1",
name: "Sunrise Villa",
location: "Mumbai",
rating: 4.8,
reviews: 124,
type: "villa",
price: 45000,
priceUnit: "/mo",

guests: 2,
bedrooms: 1,
beds: 1,
bathrooms: 1,

host:{
name:"Trina",
avatar:"https://randomuser.me/api/portraits/women/44.jpg",
rating:4.95,
reviews:120,
experience:"3 years hosting",
languages:["English","Hindi"],
responseRate:"100%",
responseTime:"within an hour"
},

description:"Experience a relaxing stay in Mumbai with beautiful interiors and peaceful surroundings.",

amenities:[
"Wifi",
"Kitchen",
"Free parking",
"Air conditioning",
"TV",
"Washing machine"
],

highlights:[
{title:"Outdoor entertainment",desc:"Enjoy a relaxing poolside experience."},
{title:"Designed for staying cool",desc:"Air conditioning and fans for comfort."},
{title:"Self check-in",desc:"Easy access using a smart lock."}
],

image:listing1,
images:[listing1,listing11,listing12,listing13,listing14],
available:true
},

{
id:"2",
name:"Farm Stay",
location:"Kochi",
rating:4.5,
reviews:89,
type:"travel",
price:12000,
priceUnit:"/night",

guests:6,
bedrooms:3,
beds:3,
bathrooms:2,

host:{
name:"Rahul",
avatar:"https://randomuser.me/api/portraits/men/32.jpg",
rating:4.8,
reviews:95,
experience:"2 years hosting",
languages:["English","Hindi"],
responseRate:"98%",
responseTime:"within 2 hours"
},

description:"The Outhouse, your peaceful family hideaway in the vibrant city of Kochi, Kerala. Tucked away in a quiet neighbourhood yet close to the city’s best attractions, Outhouse offers the perfect blend of comfort, charm, and authentic Kerala hospitality. The Outhouse is a beautifully maintained family home designed to make you feel at ease the moment you arrive. With spacious living areas, airy bedrooms, and a private garden, it’s ideal for families, friends, or traveler's looking for a relaxed stay.",

amenities:[
"Wifi",
"Kitchen",
"Parking",
"AC",
"TV",
"Free washing machine"
],

highlights:[
{title:"Extra spacious",desc:"Guests love this home’s spaciousness for a comfortable stay."},
{title:"Central location",desc:"Close to tech hubs and cafes."},
{title:"Fast WiFi",desc:"Perfect for remote work."}
],

image:listing2,
images:[listing2,listing21,listing22,listing23,listing24],
available:true
},

{
id:"3",
name:"Urban Nest PG",
location:"Delhi",
rating:4.2,
reviews:56,
type:"pgs",
price:1000,
priceUnit:"/mo",

guests:2,
bedrooms:2,
beds:2,
bathrooms:2,

host:{
name:"Priya",
avatar:"https://randomuser.me/api/portraits/women/65.jpg",
rating:4.7,
reviews:70,
experience:"4 years hosting",
languages:["English","Hindi"],
responseRate:"99%",
responseTime:"within an hour"
},

description:"Affordable and comfortable PG stay perfect for students and professionals.",

amenities:[
"Wifi",
"Meals included",
"Laundry",
"AC",
"Study desk"
],

highlights:[
{title:"Student friendly",desc:"Located near universities."},
{title:"Meals included",desc:"Daily home cooked food."},
{title:"Safe environment",desc:"24/7 security."}
],

image:listing3,
images:[listing3,listing31,listing32,listing33,listing34],
available:true
},

{
id:"4",
name:"Flat in Banglore",
location:"Banglore",
rating:4.9,
reviews:210,
type:"flats",
price:35000,
priceUnit:"/mo",

guests:4,
bedrooms:2,
beds:2,
bathrooms:2,

host:{
name:"Carlos",
avatar:"https://randomuser.me/api/portraits/men/44.jpg",
rating:4.9,
reviews:300,
experience:"5 years hosting",
languages:["English","Hindi","Portuguese"],
responseRate:"100%",
responseTime:"within 30 minutes"
},

description:"Enjoy a premium stay in this modern 2BHK apartment in Banglore, thoughtfully designed for comfort and relaxation. The apartment features swimming pool access, high-speed Wi-Fi, Smart TV, stylish interiors, and a peaceful private balcony. Located just off Candolim’s main road, the property is close to Candolim Beach, top restaurants, shopping areas, and vibrant nightlife. Perfect for families, friends, and long-stay guests",

amenities:[
"Free parking",
"Kitchen",
"Wifi",
"TV",
"AC"
],

highlights:[
{title:"Outdoor entertainment",desc:"SThe pool, alfresco dining and outdoor seating are great for summer trips."},
{title:"Designed for staying cool",desc:"Beat the heat with the A/C and ceiling fan."},
{title:"Self check-in",desc:"You can check in with the building staff."}
],

image:listing4,
images:[listing4,listing41,listing42,listing43,listing44],
available:true
},

{
id:"5",
name:"Mangowoods Megham",
location:"Kannur",
rating:4.7,
reviews:78,
type:"villa",
price:65000,
priceUnit:"/mo",

guests:8,
bedrooms:4,
beds:4,
bathrooms:3,

host:{
name:"Amit",
avatar:"https://randomuser.me/api/portraits/men/51.jpg",
rating:4.6,
reviews:90,
experience:"3 years hosting",
languages:["English","Hindi"],
responseRate:"95%",
responseTime:"within a few hours"
},

description:"Welcome to a serene retreat designed for ultimate relaxation. Kick back and unwind in this calm, stylish space, furnished to provide a perfect escape from the everyday hustle. The property boasts a spacious, fully furnished 3 BHK (Bedroom, Hall, Kitchen), offering ample room for families or groups of friends. A highlight of your stay is the private swimming pool, measuring 24x12x4.5 feet. This substantial size is perfect for a refreshing swim, a leisurely dip, or some fun pool games.",

amenities:[
"Garden",
"Pool",
"Wifi",
"Kitchen",
"Fireplace"
],

highlights:[
{title:"Nature stay",desc:"Beautiful natural surroundings."},
{title:"Private garden",desc:"Relax in your own garden."},
{title:"Quiet location",desc:"Perfect escape from city life."}
],

image:listing5,
images:[listing5,listing51,listing52,listing53,listing54],
available:false
},

{
id:"6",
name:"cabin in Kodaikkanal",
location:"Kodaikkanal",
rating:4.4,
reviews:102,
type:"travel",
price:5000,
priceUnit:"/night",

guests:2,
bedrooms:1,
beds:1,
bathrooms:1,

host:{
name:"Neha",
avatar:"https://randomuser.me/api/portraits/women/12.jpg",
rating:4.7,
reviews:150,
experience:"4 years hosting",
languages:["English","Hindi"],
responseRate:"100%",
responseTime:"within 1 hour"
},

description:"Valley View A-Frame in Kodaikanal | WanderNest is a cozy A Frame cabin nestled away at the heart of nature, located just 6 kilometers from the main city. We have combined the classic A-Frame design with a unique private deck upstairs allowing you to enjoy stunning valley views of terrace farming.",

amenities:[
"Wifi",
"Lake view",
"Nature trails",
"Cozy fireplace",
"Private deck"
],

highlights:[
{title:"Amazing outdoor space",desc:"Guests mention the grill and garden as highlights."},
{title:"Self check-in",desc:"ou can check in with the building staff."},
{title:"Extra spacious",desc:"Guests love this home’s spaciousness for a comfortable stay."}
],

image:listing6,
images:[listing6,listing61,listing62,listing63,listing64],
available:true
}

];