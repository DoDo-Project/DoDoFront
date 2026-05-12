import { RouterProvider } from 'react-router-dom';

import '@/app/styles/App.css';
import { router } from '@/app/router';

export default function App() {
  return <RouterProvider router={router} />;
}
