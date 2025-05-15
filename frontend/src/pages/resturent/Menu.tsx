import React from "react";
import ResturentSidebar from "../../components/Layout/ResturentSidebar";
import { useNavigate } from "react-router-dom";

// Mock data matching your backend model
const mockMenu = [
  {
    _id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella & basil.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
    category: "Pizza",
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Mild",
    tags: ["cheese", "vegetarian"],
    customizationOptions: [
      {
        name: "Size",
        required: true,
        options: [
          { name: "Small", price: 0 },
          { name: "Medium", price: 200 },
          { name: "Large", price: 400 },
        ]
      }
    ]
  },
  {
    _id: "2",
    name: "Spicy Chicken Wings",
    description: "Hot and crispy chicken wings with spicy sauce.",
    price: 900,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    category: "Appetizer",
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "Hot",
    tags: ["chicken", "spicy"],
    customizationOptions: [
      {
        name: "Dip",
        required: false,
        options: [
          { name: "Ranch", price: 50 },
          { name: "Blue Cheese", price: 60 }
        ]
      }
    ]
  },
  {
    _id: "3",
    name: "Vegan Buddha Bowl",
    description: "A nourishing bowl with quinoa, chickpeas, and veggies.",
    price: 1100,
    image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    category: "Bowl",
    isAvailable: false,
    preparationTime: 18,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    spiceLevel: "Medium",
    tags: ["vegan", "gluten-free", "healthy"],
    customizationOptions: []
  }
];

const Menu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[85vh] bg-softWhite dark:bg-gray-900 text-deepCharcoal dark:text-white">
      <ResturentSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <button
            className="bg-[#FF6B00] text-white px-4 py-2 rounded-lg hover:bg-[#e53900] transition"
            onClick={() => navigate("/resturent/menu/add")}
          >
            Add New Item
          </button>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Menu Items</h3>
          {mockMenu.length === 0 ? (
            <p>No menu items found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mockMenu.map(item => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold mb-1">{item.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                    <div className="mb-2">
                      <span className="font-semibold">Category:</span> {item.category}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Price:</span> Rs. {item.price}
                    </div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {item.isVegetarian && <span className="text-green-600 text-xs border border-green-600 rounded px-2 py-0.5">Vegetarian</span>}
                      {item.isVegan && <span className="text-emerald-600 text-xs border border-emerald-600 rounded px-2 py-0.5">Vegan</span>}
                      {item.isGlutenFree && <span className="text-blue-600 text-xs border border-blue-600 rounded px-2 py-0.5">Gluten Free</span>}
                      <span className="text-orange-600 text-xs border border-orange-600 rounded px-2 py-0.5">{item.spiceLevel}</span>
                      {!item.isAvailable && <span className="text-red-600 text-xs border border-red-600 rounded px-2 py-0.5">Unavailable</span>}
                    </div>
                    {item.tags.length > 0 && (
                      <div className="mb-2">
                        <span className="font-semibold">Tags:</span>{" "}
                        {item.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 mr-1">{tag}</span>
                        ))}
                      </div>
                    )}
                    {item.customizationOptions.length > 0 && (
                      <div className="mb-2">
                        <span className="font-semibold">Customizations:</span>
                        <ul className="ml-4 list-disc text-sm">
                          {item.customizationOptions.map((cust, cidx) => (
                            <li key={cidx}>
                              {cust.name} {cust.required ? "(Required)" : "(Optional)"}
                              <ul className="ml-4 list-square">
                                {cust.options.map((opt, oidx) => (
                                  <li key={oidx}>{opt.name} {opt.price > 0 && `(Rs. +${opt.price})`}</li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="text-blue-600 hover:underline">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Menu;
