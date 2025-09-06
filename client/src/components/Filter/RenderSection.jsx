import { ChevronDown, ChevronUp } from "lucide-react";

const RenderSection = ({
  title,
  sectionKey,
  options,
  getFilterCount,
  handleFilter,
  handlePriceFilter,
  handleToggle,
  isFilterActive,
  openSection,
}) => {
  const count = getFilterCount(sectionKey);

  return (
    <div className="w-full p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => handleToggle(sectionKey)}
      >
        <span
          className={`text-base sm:text-lg lg:text-xl ${
            openSection === sectionKey
              ? "text-primary font-medium"
              : "text-gray-700"
          }`}
        >
          {title}
          {count > 0 && (
            <span className="text-xs sm:text-sm lg:text-base text-gray-400 font-normal ml-2">
              ({count})
            </span>
          )}
        </span>
        {openSection === sectionKey ? (
          <ChevronUp size={20} className="text-gray-500" />
        ) : (
          <ChevronDown size={20} className="text-gray-500" />
        )}
      </div>

      {openSection === sectionKey && (
        <div className="w-full py-2 flex flex-wrap gap-2">
          {options.map((option) => {
            const isActive = isFilterActive(sectionKey, option);
            return (
              <div
                key={option.value || option.label}
                onClick={() =>
                  sectionKey === "price"
                    ? handlePriceFilter(option.min, option.max)
                    : handleFilter(sectionKey, option.value)
                }
                className={`py-1 px-6 rounded-full border cursor-pointer transition text-sm sm:text-base lg:text-lg ${
                  isActive
                    ? "bg-[#fff0f4] text-primary border-primary"
                    : "border-[#e2e1ec] hover:bg-gray-100"
                }`}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RenderSection;
