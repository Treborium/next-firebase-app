import toast from 'react-hot-toast';
import { Loader } from '../components/Loader';

export default function Home() {
  return (
    <div>
      <button onClick={() => toast.success('Hello Toast!')}>Toast me!</button>
    </div>
  );
}
