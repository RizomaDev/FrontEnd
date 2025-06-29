import React from "react";
import { Link } from "react-router-dom";

export default function Buttons({
  children,
  text,
  onClick,
  className = "",
  color = "btn-primary",
  to,
  ...props
}) {
  const content = children || text;

  if (to) {
    return (
      <Link
        to={to}
        className={`btn ${color} ${className}`}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={`btn ${color} ${className}`}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}