import React from "react";
import { formatCurrency } from "../../utils/formatters";

const ProductCard = ({ product, onEdit, onDelete, onClick }) => {
  const productImageUrl =
    product?.mainImage ||
    "https://placehold.co/400x400/2e1c1b/c9a86d?text=No+Image";

  return (
    <div className="glass-card p-4 inset-glow-border flex flex-col rounded-md overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-2xl">
      {/* Product Image */}
      <div
        onClick={() => onClick(product._id)}
        className="flex justify-center cursor-pointer items-center aspect-square h-30 overflow-hidden"
      >
        <img
          src={productImageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="px-2 pt-2 flex-grow flex flex-col gap-4 justify-between">
        <div>
          <div className="flex justify-between">
            <p className="text-xs font-IBM-Plex text-primary truncate">
              {product.category?.name || "Uncategorized"}
            </p>
            <p className="text-xs font-semibold text-primary">
              {formatCurrency(product.price.final)}
            </p>
            {/* <p
              className={`text-xs ${
                product.stock > 0 ? " text-green" : " text-red-600"
              }`}
            >
              {product.stock > 0 ? "Stock " + product.stock : "Out of Stock"}
            </p> */}
          </div>
          <h3 className="text-xs font-IBM-Plex font-medium text-black leading-tight mt-1">
            {product.name}
          </h3>
        </div>

        {/* <div className="flex justify-between items-center">
          <p className="text-xs font-bold text-primary">
            {formatCurrency(product.price.final)}
          </p>
          <p className="text-xs font-medium text-grey3">
            Stock: {product.stock > 0 ? product.stock : "out of Stock"}
          </p>
        </div> */}

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-3">
          <button
            onClick={() => onEdit(product._id)}
            className="flex-1 border text-xs rounded-sm bg-gradient-to-r from-amber-600 to-yellow-600 text-white flex items-center justify-center font-medium p-1 cursor-pointer shadow-md hover:from-yellow-600 hover:to-amber-600 transition duration-300"
          >
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 border text-xs rounded-sm bg-gradient-to-r from-red-600 to-primary text-white flex items-center justify-center font-medium p-1 cursor-pointer shadow-md hover:from-primary hover:to-red-600 transition duration-300"
          >
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
