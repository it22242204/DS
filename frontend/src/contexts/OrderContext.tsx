import React, { createContext, useContext, useState } from "react";
import { orders as mockOrders } from "@/data/mockData";

export type Order = typeof mockOrders[number];

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within an OrderProvider");
  return ctx;
};
