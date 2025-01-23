import img1 from '../assets/img1.png'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
import img4 from '../assets/img4.png'
import img5 from '../assets/img5.png'
import blog1 from '../assets/blog1.jpg'
import blog2 from '../assets/blog2.jpg'
import blog3 from '../assets/blog3.jpg'
import blog4 from '../assets/blog4.jpg'

// icons
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";

// properties data
export const PROPERTIES = [
  {
    title: "Luxurious Coastal Retreat",
    image: img1,
    category: "Villa",
    address: "Beach Road 21",
    province: "Western Cape",
    city: "Bloubergstrand",
    area: 662,
    price: 7500000,
    description: "Luxurious villa with stunning ocean views and modern amenities.",
    facilities: {
      bedrooms: 3,
      bathrooms: 2,
      parkings: 4
    }
  },
  {
    title: "Urban Oasis in the Heart of Sandton",
    image: img2,
    category: "Apartment",
    address: "1 The Da Vinci Penthouse Suites",
    province: "Gauteng",
    city: "Johannesburg",
    area: 625,
    price: 42000000,
    description: "Modern apartment in the heart of Sandton with all the conveniences.",
    facilities: {
      bedrooms: 5,
      bathrooms: 6,
      parkings: 3
    }
  },
  {
    title: "Beachfront Haven with Stunning Views",
    image: img3,
    category: "House",
    address: "53 Fish Eagle",
    province: "KwaZulu-Natal",
    city: "Ballito",
    area: 1219,
    price: 230000000,
    description: "Spacious house with direct access to the beach and beautiful sea views.",
    facilities: {
      bedrooms: 5,
      bathrooms: 4,
      parkings: 3
    }
  },
  {
    title: "Masterpiece Champagne Home",
    image: img4,
    category: "House",
    address: "Jacaranda Street 77",
    province: "Gauteng",
    city: "Pretoria East",
    area: 1596,
    price: 14900000,
    description: "Charming home in a quiet suburb with a beautiful garden.",
    facilities: {
      bedrooms: 5,
      bathrooms: 7,
      parkings: 2
    }
  },
  {
    title: "Perfect Family Home with Spacious Rooms",
    image: img5,
    category: "Residence",
    address: "Summerstrand 9",
    province: "Eastern Cape",
    city: "Port Elizabeth",
    area: 400,
    price: 3200000,
    description: "Perfect family home with spacious rooms and a large backyard.",
    facilities: {
      bedrooms: 4,
      bathrooms: 3,
      parkings: 2
    }
  },
  {
    title: "Tranquil Retreat with Modern Amenities",
    image: img1,
    category: "House",
    address: "Olive Hill 305",
    province: "Free State",
    city: "Bloemfontein",
    area: 450,
    price: 2800000,
    description: "Peaceful retreat with modern amenities and beautiful surroundings.",
    facilities: {
      bedrooms: 3,
      bathrooms: 2,
      parkings: 2
    }
  },
  {
    title: "Nature Escape Close to Reserves",
    image: img2,
    category: "Villa",
    address: "Kruger Park Road 88",
    province: "Mpumalanga",
    city: "Nelspruit",
    area: 500,
    price: 4500000,
    description: "Luxurious villa close to nature reserves with stunning views.",
    facilities: {
      bedrooms: 4,
      bathrooms: 3,
      parkings: 2
    }
  },
  {
    title: "Historic Home with Modern Updates",
    image: img3,
    category: "Cottage",
    address: "Big Hole Street 123",
    province: "Northern Cape",
    city: "Kimberley",
    area: 300,
    price: 2500000,
    description: "Historic home with modern updates and a rich history.",
    facilities: {
      bedrooms: 3,
      bathrooms: 2,
      parkings: 1
    }
  },
  {
    title: "Modern Residence with All Amenities",
    image: img4,
    category: "Residence",
    address: "Thabo Mbeki Street 42",
    province: "Limpopo",
    city: "Polokwane",
    area: 400,
    price: 3200000,
    description: "Modern residence with all the amenities for comfortable living.",
    facilities: {
      bedrooms: 4,
      bathrooms: 3,
      parkings: 2
    }
  },
];


// properties data
export const BLOGS = [
  {
    title: "Tranquil Terrace Tranquility Haven",
    image: blog1,
    category: "Cottage",
  },
  {
    title: "Oceanview Oasis Serenity Escape",
    image: blog2,
    category: "Residence",
  },
  {
    title: "Sunrise Sanctuary Solace Retreat",
    image: blog3,
    category: "House",
  },
  {
    title: "Urban Elegance Sophistication Haven",
    image: blog4,
    category: "Property",
    }
]


// FOOTER SECTION
export const FOOTER_LINKS = [
  {
    title: "Learn More",
    links: [
      "About Us",
      "Latest Items",
      "Hot Offers",
      "Popular residencies",
      "FAQ",
      "Privacy Policy",
    ],
  },
  {
    title: "Our Community",
    links: [
      "Terms and Conditions",
      "Special Offers",
      "Customer Reviews",
    ],
  },
];

export const FOOTER_CONTACT_INFO = {
  title: "Contact Us",
  links: [
    { label: "Contact Number", value: "+27 76 792 2638" },
    { label: "Email Address", value: "info@homestead.com" },
  ],
};

export const SOCIALS = {
  title: "Social",
  links: [
    { icon: <FaFacebook />, id: "facebook" },
    { icon: <FaInstagram />, id: "instagram" },
    { icon: <FaTwitter />, id: "twitter" },
    { icon: <FaYoutube />, id: "youtube" },
    { icon: <FaLinkedin />, id: "linkedin" },
  ],
};