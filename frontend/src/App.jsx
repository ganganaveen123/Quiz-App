import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/ADMIN/AdminDashboard";
import AdminRegistration from "./pages/ADMIN/AdminRegistration";
import Adminlogin from "./pages/ADMIN/Adminlogin";
import Userlogin from "./pages/Userlogin";
import UserDashboard from "./pages/UserDashboard";
import UserList from './pages/ADMIN/UserList';
import CourseList from './pages/ADMIN/courselist';
import TopicList from "./pages/ADMIN/TopicList";
import QuestionList from "./pages/ADMIN/QuestionList";
import UserRegistration from "./pages/UserRegistration";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseTopics from "./pages/CourseTopics";
import Questions from "./pages/Questions";
import Result from "./pages/Result";

import LeaderBoard from "./pages/LeaderBoard";
import Certificate from "./pages/Certificate";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Userlogin" element={<Userlogin />} />
        <Route path="/Adminlogin" element={<Adminlogin />} />
        <Route path="/UserRegistration" element={<UserRegistration />} />
        <Route path="/AdminRegistration" element={<AdminRegistration />} />
        <Route path="/UserDashboard" element={<UserDashboard />}/>
        <Route path="/AdminDashboard" element={<AdminDashboard />}/>
        <Route path="/courses" element={<Courses />}/>
        <Route path ="/courses/:courseName" element={<CourseTopics/>}/>
        <Route path="/courses/:courseName/topics/:topicId" element={<Questions />} />
        <Route path="/result" element={<Result />} />
        <Route path="/analytics" element={<PerformanceAnalytics />} />


    
        <Route path ="/leaderboard" element ={<LeaderBoard/>}/>
       <Route path ="/certificate" element ={<Certificate/>} />
       <Route path ="/UserList" element ={<UserList/>} />
       <Route path ="/CourseList" element ={<CourseList/>} />
       <Route path="/courses/:courseName/topics" element={<TopicList />} />
       <Route path="/courses/:courseName/questions" element={<QuestionList />} />
 

      </Routes>
    </Router>
  );
}

export default App;
