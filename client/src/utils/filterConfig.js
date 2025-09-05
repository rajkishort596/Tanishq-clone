import images from "./images";

export const filters = {
  // PRICE → Category-specific images
  price: (categoryName) => {
    const key = categoryName?.toLowerCase() || "default";

    const priceMap = {
      rings: [
        {
          label: "<25K",
          value: "minPrice=0&maxPrice=25000",
          img: images.priceRing25k,
        },
        {
          label: "25K-50K",
          value: "minPrice=25000&maxPrice=50000",
          img: images.priceRing50k,
        },
        {
          label: "50K-1L",
          value: "minPrice=50000&maxPrice=100000",
          img: images.priceRing1l,
        },
        {
          label: "1L & Above",
          value: "minPrice=100000",
          img: images.priceRingAbove1l,
        },
      ],
      earrings: [
        {
          label: "<25K",
          value: "minPrice=0&maxPrice=25000",
          img: images.priceEarring25k,
        },
        {
          label: "25K-50K",
          value: "minPrice=25000&maxPrice=50000",
          img: images.priceEarring50k,
        },
        {
          label: "50K-1L",
          value: "minPrice=50000&maxPrice=100000",
          img: images.priceEarring1l,
        },
        {
          label: "1L & Above",
          value: "minPrice=100000",
          img: images.priceEarringAbove1l,
        },
      ],
      "bracelets & bangles": [
        {
          label: "<25K",
          value: "minPrice=0&maxPrice=25000",
          img: images.priceBracelet25k,
        },
        {
          label: "25K-50K",
          value: "minPrice=25000&maxPrice=50000",
          img: images.priceBracelet50k,
        },
        {
          label: "50K-1L",
          value: "minPrice=50000&maxPrice=100000",
          img: images.priceBracelet1l,
        },
        {
          label: "1L & Above",
          value: "minPrice=100000",
          img: images.priceBraceletAbove1l,
        },
      ],

      necklaces: [
        {
          label: "<25K",
          value: "minPrice=0&maxPrice=25000",
          img: images.priceNecklace25k,
        },
        {
          label: "25K-50K",
          value: "minPrice=25000&maxPrice=50000",
          img: images.priceNecklace50k,
        },
        {
          label: "50K-1L",
          value: "minPrice=50000&maxPrice=100000",
          img: images.priceNecklace1l,
        },
        {
          label: "1L & Above",
          value: "minPrice=100000",
          img: images.priceNecklaceAbove1l,
        },
      ],
      gold: [
        {
          label: "<25K",
          value: "minPrice=0&maxPrice=25000",
          img: images.priceGold25k,
        },
        {
          label: "25K-50K",
          value: "minPrice=25000&maxPrice=50000",
          img: images.priceGold50k,
        },
        {
          label: "50K-1L",
          value: "minPrice=50000&maxPrice=100000",
          img: images.priceGold1l,
        },
        {
          label: "1L & Above",
          value: "minPrice=100000",
          img: images.priceGoldAbove1l,
        },
      ],
      diamond: [
        {
          label: "<25K",
          value: "minPrice=0&maxPrice=25000",
          img: images.priceDiamond25k,
        },
        {
          label: "25K-50K",
          value: "minPrice=25000&maxPrice=50000",
          img: images.priceDiamond50k,
        },
        {
          label: "50K-1L",
          value: "minPrice=50000&maxPrice=100000",
          img: images.priceDiamond1l,
        },
        {
          label: "1L & Above",
          value: "minPrice=100000",
          img: images.priceDiamondAbove1l,
        },
      ],
      default: [
        {
          label: "<25K",
          value: "minPrice=0&maxPrice=25000",
          img: images.priceDefault25k,
        },
        {
          label: "25K-50K",
          value: "minPrice=25000&maxPrice=50000",
          img: images.priceDefault50k,
        },
        {
          label: "50K-1L",
          value: "minPrice=50000&maxPrice=100000",
          img: images.priceDefault1l,
        },
        {
          label: "1L & Above",
          value: "minPrice=100000",
          img: images.priceDefaultAbove1l,
        },
      ],
    };

    return priceMap[key] || priceMap.default;
  },

  // OCCASION → same for all
  occasion: [
    { label: "Office Wear", value: "office wear", img: images.officeWear },
    { label: "Modern Wear", value: "modern wear", img: images.modernWear },
    { label: "Casual Wear", value: "casual wear", img: images.casualWear },
    {
      label: "Traditional Wear",
      value: "traditional wear",
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
        { label: "Rose Gold", value: "rose gold", img: images.roseGold },
      ],
      diamond: [], // hide metals when category is diamond
      default: [
        { label: "Diamond", value: "diamond", img: images.diamond },
        { label: "Gold", value: "gold", img: images.gold },
        { label: "Rose Gold", value: "rose gold", img: images.roseGold },
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
        { label: "Women's Rings", value: "women" },
        { label: "Men's Rings", value: "men" },
        { label: "Kids & Teens Rings", value: "kids" },
      ],
      earrings: [
        { label: "Women's Earrings", value: "women" },
        { label: "Kids & Teens Earrings", value: "kids" },
      ],
      necklaces: [
        { label: "Women's Necklaces", value: "women" },
        { label: "Kids & Teens Necklaces", value: "kids" },
      ],
      "bracelets & bangles": [
        { label: "Women's Bracelets", value: "women" },
        { label: "Men's Bracelets", value: "men" },
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
