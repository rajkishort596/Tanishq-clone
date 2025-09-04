import React from "react";
import images from "../../utils/images";
import { formatCurrency } from "../../utils/formatters";

const PriceBreakupTable = ({ priceRef, product, metalRate }) => {
  return (
    <div ref={priceRef} className="rounded-t-[20px] border-2 border-[#e0e0e0]">
      {/* Table for md+ screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-[#413f3a] text-base rounded-2xl overflow-hidden">
          <thead>
            <tr className="bg-[#f8f8f8] text-right font-IBM-Plex">
              <th className="py-4 px-8 rounded-tl-2xl text-left text-sm font-normal text-[#929292] tracking-wide">
                PRODUCT DETAILS
              </th>
              <th className="py-4 px-8 text-sm font-normal text-[#929292]">
                RATE
              </th>
              <th className="py-4 px-8 text-sm font-normal text-[#929292]">
                WEIGHT
              </th>
              <th className="py-4 px-8 rounded-tr-2xl text-sm font-normal text-[#929292]">
                VALUE
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Product Row */}
            <tr className="text-right">
              <td className="py-4 px-8 border-t text-left border-[#e0e0e0] flex items-center gap-1">
                <img
                  src={
                    product?.metal === "Gold"
                      ? images.yellowGoldIcon
                      : images.platinumIcon
                  }
                  alt="Metal Icon"
                  className="w-10 h-10"
                />
                <div>
                  <p className="font-semibold text-[1.05rem] leading-tight">
                    {product?.metal === "Gold" ? "Yellow Gold" : "Platinum"}
                  </p>
                  <p className="text-xs text-[#6f6f6f]">{product?.purity}</p>
                </div>
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">
                {formatCurrency(metalRate?.ratePerGram) + "/g" || "-"}
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0] font-medium">
                {product?.weight}g
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0] font-medium">
                {formatCurrency(product?.price.base)}
              </td>
            </tr>

            {/* Other Rows */}
            <tr className="text-right">
              <td className="py-4 px-8 border-t text-left border-[#e0e0e0]">
                Making Charges
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">-</td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">-</td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">
                {formatCurrency(product?.price.makingCharges)}
              </td>
            </tr>
            <tr className="text-right">
              <td className="py-4 px-8 border-t text-left border-[#e0e0e0]">
                Sub Total
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">-</td>
              <td className="py-4 px-8 border-t border-[#e0e0e0] font-semibold">
                {product?.weight}g <br />
                <span className="font-normal text-xs text-[#5e5e5e]">
                  Gross Wt.
                </span>
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0] font-medium">
                {formatCurrency(
                  product?.price.base + product?.price.makingCharges
                )}
              </td>
            </tr>
            <tr className="text-right">
              <td className="py-4 px-8 border-t text-left border-[#e0e0e0]">
                GST
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">-</td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">-</td>
              <td className="py-4 px-8 border-t border-[#e0e0e0]">
                {formatCurrency(product?.price.gstAmount)}
              </td>
            </tr>
            <tr className="bg-[#f8f8f8] font-semibold text-lg">
              <td
                colSpan="3"
                className="py-4 px-8 text-left border-t border-[#e0e0e0]"
              >
                Grand Total
              </td>
              <td className="py-4 px-8 border-t border-[#e0e0e0] rounded-br-2xl text-right text-black text-xl">
                {formatCurrency(product?.price.final)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Card Layout for Mobile */}
      <div className="block md:hidden divide-y divide-[#e0e0e0]">
        <div className="flex flex-col gap-4 justify-between items-center p-4">
          <div className="flex w-full items-center gap-2">
            <img
              src={
                product?.metal === "Gold"
                  ? images.yellowGoldIcon
                  : images.platinumIcon
              }
              alt="Metal Icon"
              className="w-7 h-7 object-contain"
            />
            <div className="flex justify-between items-center w-full">
              <p className="font-semibold text-sm leading-tight">
                {product?.metal === "Gold" ? "Yellow Gold" : "Platinum"}
              </p>
              <p className="text-[0.7rem] text-[#6f6f6f]">{product?.purity}</p>
            </div>
          </div>

          <div className="w-full text-right flex justify-between items-center">
            <p className="text-xs">
              {formatCurrency(metalRate?.ratePerGram)}/g
            </p>
            <p className="text-xs font-medium">{product?.weight}g</p>
            <p className="text-sm font-medium">
              {formatCurrency(product?.price.base)}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-4 p-4 text-sm">
          <span>Making Charges</span>
          <span>{formatCurrency(product?.price.makingCharges)}</span>
        </div>
        <div className="flex justify-between gap-4 p-4 text-sm">
          <span>Sub Total ({product?.weight}g Gross Wt.)</span>
          <span>
            {formatCurrency(product?.price.base + product?.price.makingCharges)}
          </span>
        </div>
        <div className="flex justify-between gap-4 p-4 text-sm">
          <span>GST</span>
          <span>{formatCurrency(product?.price.gstAmount)}</span>
        </div>
        <div className="flex justify-between gap-4 p-4 bg-[#f8f8f8] font-semibold text-base">
          <span>Grand Total</span>
          <span className="text-black text-lg">
            {formatCurrency(product?.price.final)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakupTable;
