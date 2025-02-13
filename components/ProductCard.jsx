"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/cardComponent";
import { DollarSign } from "lucide-react";

const ProductCard = ({ product }) => {
  if (!product?.id || !product?.price || !product?.title) {
    console.error("Missing required product properties", product);
    return null;
  }
  const handleBuyClick = async () => {
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          price: product.price,
          title: product.title,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Payment error:", error);
      // You might want to show an error toast here
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full">
            <span className="text-sm font-semibold text-green-600">
              ${product.price}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 text-black">
          {product.title}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Brand:</span>
            {product.brand}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Category:</span>
            {product.category}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium mr-2">Rating:</span>
            {product.rating} / 5
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <button
          onClick={handleBuyClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <DollarSign className="w-4 h-4" />
          Buy Now
        </button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
