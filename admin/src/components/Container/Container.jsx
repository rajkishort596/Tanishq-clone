const Container = ({ children, className = "" }) => {
  return (
    <div className={`w-full overflow-x-hidden mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container;
