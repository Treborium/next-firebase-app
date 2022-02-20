import { createContext } from 'react';
import { UserData } from './types';

export const UserContext = createContext<UserData>({
  user: null,
  username: null,
});
