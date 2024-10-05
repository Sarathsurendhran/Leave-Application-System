import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from "sonner";
import ReactDOM from 'react-dom/client';
import './index.css'
import { store } from './Redux/store.jsx';
import { Provider } from 'react-redux';

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Toaster richColors position="top-right" />
//     <App />
//   </StrictMode>,
// )



ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster richColors position="top-right" />
    <App />
  </Provider>
);