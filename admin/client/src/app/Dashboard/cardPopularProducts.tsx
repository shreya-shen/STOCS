import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Image from "next/image";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  // Map product names to their corresponding image file names
  const productImages : {[key: string]: string} = {
    "A4 Paper": "A4.jpg",
    "Glue": "glue.jpg",
    "Meow Pen Black": "meowPenBlack.jpg",
    "Meow Pen Blue": "meowPenBlue.jpg",
    "Record Book": "record.jpg",
    "Rough Book Ruled": "roughBook.jpg",
    "Rough Book Unruled": "roughBook.jpg",
    "100 Page Ruled Notebook": "sahyBook.jpg",
    "200 Page Ruled Notebook": "sahyBook.jpg",
    "100 Page Unruled Notebook": "sahyBook.jpg",
    "200 Page Unruled Notebook": "sahyBook.jpg",
    "Blue Book": "placeholder.png",
    "Yellow Book": "placeholder.png",
    "Scissors": "scissors.jpg",
    "Tape": "tape.jpg",
  };

  return (
    <div className="row-span-3 xl:row-span-8 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={`/images/${
                      productImages[product.name] || "placeholder.png"
                    }`}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-lg w-14 h-14"
                  />
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">
                      {product.name}
                    </div>
                    <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        ₹{product.price}
                      </span>
                      <span className="mx-2">|</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs flex items-center">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  {Math.round(product.stockQuantity)} Sold
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;