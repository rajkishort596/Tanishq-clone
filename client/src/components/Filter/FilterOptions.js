export const filterOptions = {
  price: [
    { label: "< ₹25,000", max: 25000 },
    { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
    { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
    { label: "₹1,00,000 +", min: 100000, max: 200000 },
    { label: "₹2,00,000 - ₹5,00,000", min: 200000, max: 500000 },
    { label: "₹5,00,000 - ₹10,00,000", min: 500000, max: 1000000 },
    { label: "Over ₹10,00,000", min: 1000000 },
  ],
  occasion: [
    { label: "Everyday Wear", value: "everyday wear" },
    { label: "Party Wear", value: "party" },
    { label: "Wedding", value: "wedding" },
    { label: "Bridal Wear", value: "bridal wear" },
    { label: "Daily Wear", value: "daily wear" },
    { label: "Modern Wear", value: "modern wear" },
    { label: "Office Wear", value: "office wear" },
    { label: "Engagement", value: "engagement" },
  ],
  gender: [
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
    { label: "Kids", value: "kids" },
    { label: "Unisex", value: "unisex" },
  ],
  metal: [
    { label: "Gold", value: "gold" },
    { label: "Platinum", value: "platinum" },
  ],
  purity: [
    { label: "14K", value: "14k" },
    { label: "18K", value: "18k" },
    { label: "22K", value: "22k" },
    { label: "PT950", value: "pt950" },
  ],
  metalColor: [
    { label: "Rose Gold", value: "rose gold" },
    { label: "Yellow", value: "yellow" },
    { label: "White", value: "white" },
    { label: "White Gold", value: "white gold" },
  ],
};
