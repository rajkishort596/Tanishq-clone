const FilterSection = ({ title, options, onSelect }) => (
  <div className="mb-6">
    <h3 className="font-normal font-fraunces text-lg mb-2">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt)}
          className="border border-[#e2e1df] rounded-lg py-2 px-[10px] text-sm font-IBM-Plex font-normal"
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);
export default FilterSection;
