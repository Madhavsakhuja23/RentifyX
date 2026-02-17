import "./Button.css";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`custom-btn ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
