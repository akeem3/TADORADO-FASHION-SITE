interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="
    min-h-screen
    max-w-[1920px]
    mx-auto
    "
    >
      {children}
    </div>
  );
};

export default Container;
