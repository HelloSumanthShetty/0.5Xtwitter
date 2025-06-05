  import { Route,Routes } from "react-router-dom"
 import HomePage from "./pages/home/HomePage"
 import SignupPage from "./pages/auth/signup/SignupPage"
 import LoginPage from "./pages/auth/login/loginPage" 

import NotificationPage from "./pages/notifications/Notificationpage"
import ProfilePage from "./pages/profile/Profilepage"

 import Sidebar from "./components/commen/Sidebar"
 import Rigthbar from './components/commen/Rightbar'

function App() {
    

    return (
      
      <div className="flex mx-auto max-w-6xl">
     <Sidebar/>
      <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
         <Route path="/notifications" element={<NotificationPage/>}/>

            <Route path="/profile/:name" element={<ProfilePage/>}/>
      </Routes>
  <Rigthbar/>

      </div>
      
      
    )
  }

  export default App
