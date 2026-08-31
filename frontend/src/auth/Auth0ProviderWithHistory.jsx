// Auth0 context provider

import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

function Auth0ProviderWithHistory({ children }) {

  const domain   = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;


  if (!domain || !clientId || !audience) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0f172a', color: '#f87171',
        fontFamily: 'monospace', padding: '2rem', textAlign: 'center',
      }}>
        <div>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⚠️ Auth0 config missing</p>
          <p>Create <code>frontend/.env</code> and set:</p>
          <pre style={{ textAlign: 'left', marginTop: '1rem', color: '#94a3b8' }}>
            {`VITE_AUTH0_DOMAIN=your-tenant.auth0.com\nVITE_AUTH0_CLIENT_ID=your-client-id\nVITE_AUTH0_AUDIENCE=https://weather-comfort-api`}
          </pre>
        </div>
      </div>
    );
  }


  const onRedirectCallback = (appState) => {
    window.history.replaceState(
      {},                                         
      document.title,                            
      appState?.returnTo || window.location.pathname 
    );
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
       
        redirect_uri: window.location.origin,

        
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}

export default Auth0ProviderWithHistory;
