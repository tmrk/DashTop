import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { LogLevel } from "@azure/msal-browser";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MSAL_CLIENT_ID,
    authority: process.env.REACT_APP_MSAL_AUTHORITY,
    redirectUri: "https://github.com/tmrk/dashtop/"
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {	
    loggerOptions: {	
      loggerCallback: (level, message, containsPii) => {	
        if (containsPii) {
          return;		
        }		
        switch (level) {		
          case LogLevel.Error:		
            console.error(message);		
            return;		
          case LogLevel.Info:		
            console.info(message);		
            return;		
          case LogLevel.Verbose:		
            console.debug(message);		
            return;		
          case LogLevel.Warning:		
            console.warn(message);		
            return;		
        }	
      }	
    }	
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();