import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { auth, googleAuthProvider } from '../lib/firebase';

export default function Page() {
  const { user, username } = useContext(UserContext);

  const RegisteredUser: React.FC<{}> = () => {
    return !username ? <UsernameForm /> : <SignInButton />;
  };

  return <main>{user ? <RegisteredUser /> : <SignInButton />}</main>;
}

const SignInButton: React.FC<{}> = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src="/google.png" alt="google logo" />
      Sign in with Google
    </button>
  );
};

const SignOutButton: React.FC<{}> = () => {
  return <button onClick={() => auth.signOut()}>Sign out</button>;
};

const UsernameForm: React.FC<{}> = () => {
  return <></>;
};
