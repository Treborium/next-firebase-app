import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

interface AuthCheckProps {
  fallback?: JSX.Element;
}

export const AuthCheck: React.FC<AuthCheckProps> = (props) => {
  const { username } = useContext(UserContext);

  return username ? (
    <>{props.children}</>
  ) : (
    props.fallback || <Link href="/enter">You must be signed in</Link>
  );
};
