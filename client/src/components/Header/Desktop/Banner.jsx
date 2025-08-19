import { Link } from "react-router-dom";
import { bannerConfig } from "../../../utils/bannerConfig";
import images from "../../../utils/images";

const Banner = ({ categoryName }) => {
  const banner = bannerConfig[categoryName];

  return (
    <Link to={banner?.path || "/"}>
      <img
        className="rounded-lg h-full w-full object-center object-cover"
        src={banner?.img?.desktop || images.soulmateBanner}
        alt={`${categoryName || "Default"} Banner`}
      />
    </Link>
  );
};

export default Banner;
