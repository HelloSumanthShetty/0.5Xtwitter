import { Route, Routes,Navigate,useNavigate } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import SignupPage from "./pages/auth/signup/SignupPage"
import LoginPage from "./pages/auth/login/loginPage"
import { useEffect } from "react"
import NotificationPage from "./pages/notifications/Notificationpage"
import ProfilePage from "./pages/profile/Profilepage"
import MainLayout from "./components/layout/Mainlayout"
import Sidebar from "./components/commen/Sidebar"
import Rigthbar from './components/commen/Rightbar'
import { Toaster } from "react-hot-toast"
import { useQuery, } from "@tanstack/react-query"
import LoadingSpinner from "./components/commen/Loadingspinner"

function App() {
  
  const { data: authuser, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/me", {
          method: "GET"
        }
        )
     
       
       
        const data = await res.json()
        console.log(data.error)
     if(data.error) return null 
        console.log(data)
        return data
 
      } catch (error) {
        console.error(error)
            
  
        throw error
      }

    },      
  refetchOnWindowFocus:false
  

  }
) 
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
 

      </div>

    )
  }
  console.log("sfs"+authuser)
  	


  return (

    <div >
    
      <Routes>
        <Route path="/signup" element={!authuser?<SignupPage />:<Navigate to="/"/>} />
        <Route path="/login" element={!authuser?<LoginPage />:<Navigate to='/'/>} />
        
        <Route element={authuser ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>
      </Routes>
  
      <Toaster />
    </div>


  )
}

export default App
