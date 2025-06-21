
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { StrictMode } from 'react'
import {QueryClientProvider,QueryClient}  from "@tanstack/react-query"

const queryclient=new QueryClient({
  defaultOptions:{
    queries:{
     // queryFn:App,
      retry:false,
      refetchOnWindowFocus:false,
      //refetchInterval:5000
    }
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <QueryClientProvider client={queryclient}>
   <App/>
   </QueryClientProvider>
   </BrowserRouter>
  </StrictMode>
)
