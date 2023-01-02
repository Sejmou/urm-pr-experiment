console.log(window.location.pathname.split('/').pop());
if (window.location.pathname.split('/').pop() !== '') {
  console.log('here');
  console.log(window.location.pathname);
  window.location.pathname = '';
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Home';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
