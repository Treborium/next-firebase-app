import { User } from 'firebase/auth';

export interface UserData {
  user: User | null;
  username: string | null;
}