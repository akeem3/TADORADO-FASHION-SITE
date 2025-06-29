interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "xl",
  padding = "md",
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-4",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12",
    xl: "px-8 sm:px-12 lg:px-16",
  };

  return (
    <div
      className={`
        mx-auto
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
};

export default Container;
