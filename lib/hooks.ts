import { auth } from './firebase';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';

export const useUserData = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      const ref = doc(getFirestore(), 'users', user.uid);
      unsubscribe = onSnapshot(ref, (document) => {
        setUsername(document.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe
  }, [user]);

  return { user, username };
};
