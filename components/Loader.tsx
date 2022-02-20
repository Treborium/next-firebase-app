interface LoaderProps {
  show: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ show }) => {
  return show ? <div className="loader"/> : null;
};
