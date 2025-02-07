import React from "react";

const Card = ({ className = "", children, ...props }) => {
  const mergeClasses = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div
      className={mergeClasses(
        "rounded-lg border border-gray-200 bg-white shadow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
