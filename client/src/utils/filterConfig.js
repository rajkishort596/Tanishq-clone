import images from "./images";

export const filters = {
  // PRICE → Category-specific images
  price: (categoryName) => {
    const key = categoryName?.toLowerCase() || "default";

    const priceMap = {
      rings: [
        { label: "<25K", value: "under-25k", img: images.priceRing25k },
        { label: "25K-50K", value: "25k-50k", img: images.priceRing50k },
        { label: "50K-1L", value: "50k-1l", img: images.priceRing1l },
        {
          label: "1L & Above",
          value: "1l-above",
          img: images.priceRingAbove1l,
        },
      ],
      earrings: [
        { label: "<25K", value: "under-25k", img: images.priceEarring25k },
        { label: "25K-50K", value: "25k-50k", img: images.priceEarring50k },
        { label: "50K-1L", value: "50k-1l", img: images.priceEarring1l },
        {
          label: "1L & Above",
          value: "1l-above",
          img: images.priceEarringAbove1l,
        },
      ],
      "bracelets & bangles": [
        { label: "<25K", value: "under-25k", img: images.priceBracelet25k },
        { label: "25K-50K", value: "25k-50k", img: images.priceBracelet50k },
        { label: "50K-1L", value: "50k-1l", img: images.priceBracelet1l },
        {
          label: "1L & Above",
          value: "1l-above",
          img: images.priceBraceletAbove1l,
        },
      ],

      necklaces: [
        { label: "<25K", value: "under-25k", img: images.priceNecklace25k },
        { label: "25K-50K", value: "25k-50k", img: images.priceNecklace50k },
        { label: "50K-1L", value: "50k-1l", img: images.priceNecklace1l },
        {
          label: "1L & Above",
          value: "1l-above",
          img: images.priceNecklaceAbove1l,
        },
      ],
      gold: [
        { label: "<25K", value: "under-25k", img: images.priceGold25k },
        { label: "25K-50K", value: "25k-50k", img: images.priceGold50k },
        { label: "50K-1L", value: "50k-1l", img: images.priceGold1l },
        {
          label: "1L & Above",
          value: "1l-above",
          img: images.priceGoldAbove1l,
        },
      ],
      diamond: [
        { label: "<25K", value: "under-25k", img: images.priceDiamond25k },
        { label: "25K-50K", value: "25k-50k", img: images.priceDiamond50k },
        { label: "50K-1L", value: "50k-1l", img: images.priceDiamond1l },
        {
          label: "1L & Above",
          value: "1l-above",
          img: images.priceDiamondAbove1l,
        },
      ],
      default: [
        { label: "<25K", value: "under-25k", img: images.priceDefault25k },
        { label: "25K-50K", value: "25k-50k", img: images.priceDefault50k },
        { label: "50K-1L", value: "50k-1l", img: images.priceDefault1l },
        {
          label: "1L & Above",
          value: "1l-above",
          img: images.priceDefaultAbove1l,
        },
      ],
    };

    return priceMap[key] || priceMap.default;
  },

  // OCCASION → same for all
  occasion: [
    { label: "Office Wear", value: "office", img: images.officeWear },
    { label: "Modern Wear", value: "modern", img: images.modernWear },
    { label: "Casual Wear", value: "casual", img: images.casualWear },
    {
      label: "Traditional Wear",
      value: "traditional",
      img: images.traditionalWear,
    },
  ],

  // METALS → same for all
  // metals: [
  //   { label: "Diamond", value: "diamond", img: images.diamond },
  //   { label: "Gold", value: "gold", img: images.gold },
  //   { label: "Rose Gold", value: "rose-gold", img: images.roseGold },
  //   { label: "Platinum Metal", value: "platinum", img: images.platinum },
  // ],

  metals: (categoryName) => {
    const key = categoryName?.toLowerCase();

    const metalsMap = {
      gold: [
        { label: "Gold", value: "gold", img: images.gold },
        { label: "Rose Gold", value: "rose-gold", img: images.roseGold },
      ],
      diamond: [], // hide metals when category is diamond
      default: [
        { label: "Diamond", value: "diamond", img: images.diamond },
        { label: "Gold", value: "gold", img: images.gold },
        { label: "Rose Gold", value: "rose-gold", img: images.roseGold },
        { label: "Platinum Metal", value: "platinum", img: images.platinum },
      ],
    };

    return metalsMap[key] || metalsMap.default;
  },

  // GENDER → labels depend on category, but images are reused
  gender: (categoryName) => {
    const key = categoryName?.toLowerCase();

    const genderLabels = {
      rings: [
        { label: "Women's Rings", value: "women-rings" },
        { label: "Men's Rings", value: "men-rings" },
        { label: "Kids & Teens Rings", value: "kids-rings" },
      ],
      earrings: [
        { label: "Women's Earrings", value: "women-earrings" },
        { label: "Kids & Teens Earrings", value: "kids-earrings" },
      ],
      necklaces: [
        { label: "Women's Necklaces", value: "women-necklaces" },
        { label: "Kids & Teens Necklaces", value: "kids-necklaces" },
      ],
      "bracelets & bangles": [
        { label: "Women's Bracelets", value: "women-bracelets" },
        { label: "Men's Bracelets", value: "men-bracelets" },
      ],
      default: [
        { label: "Women's Jewellery", value: "women" },
        { label: "Men's Jewellery", value: "men" },
        { label: "Kids & Teens", value: "kids" },
      ],
    };

    // Assign images dynamically
    const imageMap = {
      women: images.genderWomen,
      men: images.genderMen,
      kids: images.genderKids,
    };

    return (genderLabels[key] || genderLabels.default).map((opt) => ({
      ...opt,
      img: opt.value.includes("women")
        ? imageMap.women
        : opt.value.includes("men")
        ? imageMap.men
        : imageMap.kids,
    }));
  },
};
