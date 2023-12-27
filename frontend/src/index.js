import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = document.getElementById('root');
const reactRoot = createRoot(root);

reactRoot.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
