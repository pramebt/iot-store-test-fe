const PageContainer = ({ 
  children, 
  className = '',
  maxWidth = '7xl',
  padding = true,
  ...props 
}) => {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full',
  };

  return (
    <div 
      className={`
        ${maxWidthClasses[maxWidth] || maxWidthClasses['7xl']} 
        mx-auto 
        ${padding ? 'px-6 py-12' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
