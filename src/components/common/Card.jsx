const Card = ({ 
  children, 
  title, 
  className = '',
  padding = true,
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
