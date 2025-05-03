import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './index1.css'
import { PersistGate } from 'redux-persist/lib/integration/react.js';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading.....</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
