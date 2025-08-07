import React from "react";
import images from "../../constants/images";
import { formatCurrency } from "../../utils/formatters";

const PriceBreakupTable = ({ priceRef, product, metalRate }) => {
  return (
    <div
      ref={priceRef}
      className="overflow-x-auto rounded-t-[20px] border-2 border-[#e0e0e0]"
    >
      <table className="w-full text-[#413f3a] text-base rounded-2xl overflow-hidden">
        <thead>
          <tr className="bg-[#f8f8f8] text-right font-IBM-Plex">
            <th className="py-4 px-8 rounded-tl-2xl text-left text-sm font-normal text-[#929292]  tracking-wide">
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
          <tr className="text-right">
            <td className="py-4 px-8 border-t text-left border-[#e0e0e0] flex items-center gap-1">
              <img
                src={
                  product?.metal === "Gold"
                    ? images.yellowGoldIcon
                    : images.platinumIcon
                }
                alt="Gold Coin"
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
  );
};

export default PriceBreakupTable;
