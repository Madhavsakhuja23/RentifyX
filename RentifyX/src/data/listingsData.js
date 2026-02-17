const listingsData = [

  // ================= HOUSES =================
  {
    id: 1,
    category: "Houses",
    name: "Luxury Villa in Mumbai",
    location: "Mumbai",
    rating: 4.8,
    reviews: 245,
    type: "4 BHK",
    price: 85000,
    availability: "Available",
    minStay: "6 months",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  },
  {
    id: 2,
    category: "Houses",
    name: "Modern House in Bangalore",
    location: "Bangalore",
    rating: 4.7,
    reviews: 180,
    type: "3 BHK",
    price: 72000,
    availability: "Available",
    minStay: "6 months",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e"
  },
  {
    id: 3,
    category: "Houses",
    name: "Independent House in Hyderabad",
    location: "Hyderabad",
    rating: 4.5,
    reviews: 130,
    type: "3 BHK",
    price: 65000,
    availability: "Available",
    minStay: "6 months",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
  },
  {
    id: 4,
    category: "Houses",
    name: "Premium Villa in Pune",
    location: "Pune",
    rating: 4.6,
    reviews: 165,
    type: "4 BHK",
    price: 78000,
    availability: "Available",
    minStay: "6 months",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde"
  },
  {
    id: 5,
    category: "Houses",
    name: "Beach House in Goa",
    location: "Goa",
    rating: 4.9,
    reviews: 310,
    type: "5 BHK",
    price: 95000,
    availability: "Available",
    minStay: "6 months",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
  },

  // ================= FLATS =================
  {
    id: 6,
    category: "Flats",
    name: "2 BHK in Delhi",
    location: "Delhi",
    rating: 4.6,
    reviews: 102,
    type: "2 BHK",
    price: 37855,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
  },
  {
    id: 7,
    category: "Flats",
    name: "1 BHK in Chennai",
    location: "Chennai",
    rating: 4.4,
    reviews: 90,
    type: "1 BHK",
    price: 22000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
  },
  {
    id: 8,
    category: "Flats",
    name: "3 BHK in Mumbai",
    location: "Mumbai",
    rating: 4.7,
    reviews: 210,
    type: "3 BHK",
    price: 55000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
  },
  {
    id: 9,
    category: "Flats",
    name: "Studio Flat in Pune",
    location: "Pune",
    rating: 4.3,
    reviews: 75,
    type: "Studio",
    price: 18000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc"
  },
  {
    id: 10,
    category: "Flats",
    name: "2 BHK in Ahmedabad",
    location: "Ahmedabad",
    rating: 4.5,
    reviews: 120,
    type: "2 BHK",
    price: 26000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },

  // ================= PGs =================
  {
    id: 11,
    category: "PGs",
    name: "Girls PG in Bangalore",
    location: "Bangalore",
    rating: 4.2,
    reviews: 89,
    type: "Single Sharing",
    price: 12000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb"
  },
  {
    id: 12,
    category: "PGs",
    name: "Boys PG in Delhi",
    location: "Delhi",
    rating: 4.1,
    reviews: 70,
    type: "Double Sharing",
    price: 9000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf"
  },
  {
    id: 13,
    category: "PGs",
    name: "Working Women PG in Mumbai",
    location: "Mumbai",
    rating: 4.4,
    reviews: 150,
    type: "Single Sharing",
    price: 15000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c"
  },
  {
    id: 14,
    category: "PGs",
    name: "Student PG in Hyderabad",
    location: "Hyderabad",
    rating: 4.0,
    reviews: 60,
    type: "Triple Sharing",
    price: 8000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45"
  },
  {
    id: 15,
    category: "PGs",
    name: "Premium PG in Pune",
    location: "Pune",
    rating: 4.3,
    reviews: 95,
    type: "Single Sharing",
    price: 14000,
    availability: "Available",
    minStay: "1 month",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353"
  },

  // ================= TRAVEL STAYS =================
  {
    id: 16,
    category: "Travel Stays",
    name: "Goa Beach Stay",
    location: "Goa",
    rating: 4.9,
    reviews: 301,
    type: "Beach Villa",
    price: 2500,
    availability: "Available",
    minStay: "Hourly",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
  },
  {
    id: 17,
    category: "Travel Stays",
    name: "Manali Cabin Retreat",
    location: "Manali",
    rating: 4.8,
    reviews: 220,
    type: "Wooden Cabin",
    price: 1800,
    availability: "Available",
    minStay: "Hourly",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
  },
  {
    id: 18,
    category: "Travel Stays",
    name: "Jaipur Heritage Stay",
    location: "Jaipur",
    rating: 4.7,
    reviews: 175,
    type: "Heritage Haveli",
    price: 2200,
    availability: "Available",
    minStay: "Hourly",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427"
  },
  {
    id: 19,
    category: "Travel Stays",
    name: "Kerala Backwater Stay",
    location: "Kerala",
    rating: 4.9,
    reviews: 290,
    type: "Houseboat",
    price: 3000,
    availability: "Available",
    minStay: "Hourly",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: 20,
    category: "Travel Stays",
    name: "Rishikesh Riverside Stay",
    location: "Rishikesh",
    rating: 4.6,
    reviews: 140,
    type: "Camp Stay",
    price: 1500,
    availability: "Available",
    minStay: "Hourly",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  }

];

export default listingsData;
