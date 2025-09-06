import { filterOptions } from "./FilterOptions";

export const sections = [
  { title: "Price", key: "price", options: filterOptions.price },
  { title: "Occasion", key: "occasion", options: filterOptions.occasion },
  { title: "Gender", key: "gender", options: filterOptions.gender },
  { title: "Metal Type", key: "metal", options: filterOptions.metal },
  { title: "Purity", key: "purity", options: filterOptions.purity },
  {
    title: "Metal Color",
    key: "metalColor",
    options: filterOptions.metalColor,
  },
];
