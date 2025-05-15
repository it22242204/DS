
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  PieChart,
  BarChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, ChartBar, Star } from "lucide-react";

// Dummy Data (You can replace this later with props or API data)
const salesData = [
  { name: "Jan", revenue: 29000, orders: 120 },
  { name: "Feb", revenue: 35000, orders: 145 },
  { name: "Mar", revenue: 42000, orders: 180 },
  { name: "Apr", revenue: 38000, orders: 160 },
  { name: "May", revenue: 45000, orders: 190 },
  { name: "Jun", revenue: 52000, orders: 210 },
  { name: "Jul", revenue: 58000, orders: 235 },
  { name: "Aug", revenue: 62000, orders: 250 },
  { name: "Sep", revenue: 56000, orders: 225 },
  { name: "Oct", revenue: 64000, orders: 265 },
  { name: "Nov", revenue: 70000, orders: 285 },
  { name: "Dec", revenue: 78000, orders: 310 },
];

const popularCuisineData = [
  { name: "Italian", value: 30 },
  { name: "American", value: 25 },
  { name: "Indian", value: 20 },
  { name: "Japanese", value: 15 },
  { name: "Chinese", value: 10 },
  { name: "Sri Lankan", value: 5 },
];

const restaurantRatingData = [
  { name: "5 Stars", count: 45 },
  { name: "4 Stars", count: 28 },
  { name: "3 Stars", count: 15 },
  { name: "2 Stars", count: 8 },
  { name: "1 Star", count: 4 },
];

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

const DeliveryAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">    
      {/* Tabs for Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue & Orders</TabsTrigger>
          <TabsTrigger value="cuisine">Cuisine Breakdown</TabsTrigger>
          <TabsTrigger value="ratings">Restaurant Ratings</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative h-[400px]">
                <ChartContainer
                  config={{
                    revenue: { color: "#FF6384" },
                    orders: { color: "#36A2EB" },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#FF6384" />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#36A2EB" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cuisine">
          <Card>
            <CardHeader>
              <CardTitle>Popular Cuisines</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={popularCuisineData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={150}
                      fill="#8884d8"
                      label
                    >
                      {popularCuisineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Ratings</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={restaurantRatingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryAnalytics;
