import "./Input.css";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`custom-input ${className}`}
    />
  );
};

export default Input;
