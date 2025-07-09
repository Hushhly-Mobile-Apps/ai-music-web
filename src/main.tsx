import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mock window.ezsite untuk development agar aplikasi tidak blank
if (typeof window !== 'undefined' && !window.ezsite) {
  window.ezsite = {
    apis: {
      tablePage: async () => ({ data: { List: [] }, error: null }),
      tableCreate: async () => ({ data: null, error: null }),
      tableUpdate: async () => ({ data: null, error: null }),
      tableDelete: async () => ({ data: null, error: null }),
      upload: async () => ({ data: null, error: null }),
      getUserInfo: async () => ({ data: { id: 1, name: 'Mock User' }, error: null }),
      login: async () => ({ data: { token: 'mock' }, error: null }),
      logout: async () => ({ data: null, error: null }),
      register: async () => ({ data: { id: 1 }, error: null }),
      resetPassword: async () => ({ data: null, error: null }),
      sendResetPwdEmail: async () => ({ data: null, error: null }),
    }
  };
}

createRoot(document.getElementById("root")!).render(<App />);