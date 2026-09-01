import React from 'react';
import ReactDOM from 'react-dom/client';


import './index.css';


import App from './App.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    {/*
       wrap <App /> with <Auth0Provider> here.
      The provider pattern ensures the Auth0 context is available
      to every component in the tree without prop drilling.
    */}
    <App />
  </React.StrictMode>
);
