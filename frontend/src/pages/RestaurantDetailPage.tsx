import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Info, Plus } from "lucide-react";
import { restaurants, menuItems } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

// --- MenuItem type ---
type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
};

const RestaurantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Menu");

  const { addItem } = useCart();

  // Function to handle adding item and navigating to cart
  const handleAddToCart = (menuItem: MenuItem) => {
    addItem(menuItem);
    navigate("/cart");
  };

 useEffect(() => {
  console.log("menuItems:", menuItems);
  console.log("id:", id);
  const foundRestaurant = restaurants.find((r) => r.id === id);
  setRestaurant(foundRestaurant || null);

  if (id) {
    const restaurantMenu = (menuItems as MenuItem[]).filter(
      (item) => item.restaurantId === id
    );
    console.log("restaurantMenu:", restaurantMenu);
    setMenu(restaurantMenu);

    const uniqueCategories = [
      ...new Set(restaurantMenu.map((item) => item.category)),
    ];
    setCategories(uniqueCategories);
  }
}, [id]);


  if (!restaurant) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold">Restaurant not found</h2>
      </div>
    );
  }

  const groupedMenu = categories.map((category) => ({
    category,
    items: menu.filter((item) => item.category === category),
  }));

  return (
    <div className="flex flex-col">
      {/* Restaurant Cover Image */}
      <div
        className="h-64 md:h-80 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.coverImage || restaurant.image})` }}
      >
        <div className="h-full w-full bg-black/50 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <Badge className="bg-white/20 hover:bg-white/30 text-white">
                {restaurant.cuisine}
              </Badge>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              {restaurant.isOpen ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Open
                </Badge>
              ) : (
                <Badge variant="destructive">Closed</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="Menu" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="Menu">Menu</TabsTrigger>
            <TabsTrigger value="Info">Info</TabsTrigger>
            <TabsTrigger value="Reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="Menu">
            {groupedMenu.length > 0 ? (
              groupedMenu.map((group) => (
                <div key={group.category} className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">{group.category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((menuItem) => (
                      <Card key={menuItem.id} className="overflow-hidden border hover:border-primary/30 transition-colors">
                        <div className="flex flex-col sm:flex-row h-full">
                          <div className="sm:w-1/3 h-32 sm:h-auto overflow-hidden">
                            <img
                              src={menuItem.image}
                              alt={menuItem.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="flex-1 flex flex-col justify-between p-4">
                            <div>
                              <h3 className="text-lg font-semibold">{menuItem.name}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{menuItem.description}</p>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-primary">Rs. {menuItem.price}</span>
                                {menuItem.isPopular && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button className="mt-2 w-full" onClick={() => handleAddToCart(menuItem)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <h3 className="text-lg font-semibold">No menu items available</h3>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Info">
            <div className="text-gray-700">
              <h2 className="text-xl font-bold mb-2">About {restaurant.name}</h2>
              <p>{restaurant.description}</p>
              <Separator className="my-4" />
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Info className="h-5 w-5" />
                <span>Delivery Time: {restaurant.deliveryTime}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Reviews">
            <div className="text-gray-700">
              <h2 className="text-xl font-bold mb-2">Reviews</h2>
              <p>No reviews yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
