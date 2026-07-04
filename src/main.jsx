import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_CxnBEFiMN',
      userPoolClientId: '7tigqgcud2s0kd3o2ot79bevd2',
      region: 'eu-north-1',
      loginWith: {
        email: true,
      }
    }
  }
});

createRoot(document.getElementById('root')).render(
 // <StrictMode>
    <App />
 // </StrictMode>,
);