"use client";

import { useState, useEffect } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
  stock: number;
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
    setIsLoading(false);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (item: CartItem) => {
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.productId === item.productId && cartItem.size === item.size,
    );

    if (existingItem) {
      // Validar que no exceda el stock
      const newQuantity = existingItem.quantity + item.quantity;
      if (newQuantity > item.stock) {
        throw new Error(
          `No hay suficiente stock. Stock disponible: ${item.stock}`,
        );
      }
      const updatedCart = cart.map((cartItem) =>
        cartItem.productId === item.productId && cartItem.size === item.size
          ? { ...cartItem, quantity: newQuantity, stock: item.stock }
          : cartItem,
      );
      saveCart(updatedCart);
    } else {
      // Validar que la cantidad inicial no exceda el stock
      if (item.quantity > item.stock) {
        throw new Error(
          `No hay suficiente stock. Stock disponible: ${item.stock}`,
        );
      }
      saveCart([...cart, item]);
    }
  };

  const removeFromCart = (productId: string, size?: string) => {
    const updatedCart = cart.filter(
      (item) => !(item.productId === productId && item.size === size),
    );
    saveCart(updatedCart);
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
  ) => {
    // Validar que la cantidad no sea negativa
    if (quantity < 0) {
      return;
    }

    // Si la cantidad es 0 o menor, eliminar del carrito
    if (quantity === 0) {
      removeFromCart(productId, size);
      return;
    }

    // Buscar el item en el carrito para obtener el stock
    const cartItem = cart.find(
      (item) => item.productId === productId && item.size === size,
    );

    if (!cartItem) {
      return;
    }

    // Validar que no exceda el stock
    if (quantity > cartItem.stock) {
      throw new Error(
        `No hay suficiente stock. Stock disponible: ${cartItem.stock}`,
      );
    }

    const updatedCart = cart.map((item) =>
      item.productId === productId && item.size === size
        ? { ...item, quantity }
        : item,
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };
}
