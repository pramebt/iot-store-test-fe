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
        bg-white rounded-2xl shadow-sm border border-gray-200
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-md transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {title && (
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
