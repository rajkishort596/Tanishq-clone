import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center">
      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
