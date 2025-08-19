import { Link } from "react-router-dom";
import { bannerConfig } from "../../../utils/bannerConfig";
import images from "../../../utils/images";

const Banner = ({ categoryName, onClose }) => {
  const banner = bannerConfig[categoryName];

  return (
    <Link to={banner?.path || "/"} onClick={onClose}>
      <img
        className="w-full h-full object-cover"
        src={banner?.img.mobile || images.soulmateBanner}
        alt={`${categoryName || "Default"} Banner`}
      />
    </Link>
  );
};

export default Banner;
