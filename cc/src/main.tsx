import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/themeContext.tsx'
import { UserProvider } from './context/userContext.tsx'
import { WorkspaceProvider } from './context/workspaceContext.tsx'

createRoot(document.getElementById('root')!).render(
 
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          
            <App />
          
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
    
 ,
)
