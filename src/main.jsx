import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './Store';
import App from './App';
import SceneRenderComponent from './Components/SceneRenderComponent';
import ApiConnection from './Components/ApiConnection';

const root = document.getElementById('root');

// Use createRoot once and store it in a variable
const rootElement = ReactDOM.createRoot(root);

// Wrap your app inside the Provider and render it inside the root element
rootElement.render(
    <Provider store={store}>
      <ApiConnection/>
      <App />
    </Provider>
);
