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
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminAnalytics from "./pages/ADMIN/AdminAnalytics";

// Import mobile responsive CSS
import "./mobile-responsive.css";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Userlogin" element={<Userlogin />} />
        <Route path="/Adminlogin" element={<Adminlogin />} />
        <Route path="/UserRegistration" element={<UserRegistration />} />
        <Route path="/AdminRegistration" element={<AdminRegistration />} />

        {/* User-Only Routes */}
        <Route path="/UserDashboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/courses" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Courses />
          </ProtectedRoute>
        }/>
        <Route path="/courses/:courseName" element={
          <ProtectedRoute allowedRoles={['user']}>
            <CourseTopics/>
          </ProtectedRoute>
        }/>
        <Route path="/courses/:courseName/topics/:topicId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Questions />
          </ProtectedRoute>
        } />
        <Route path="/result" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Result />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['user']}>
            <PerformanceAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <LeaderBoard/>
          </ProtectedRoute>
        }/>
        <Route path="/certificate" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Certificate/>
          </ProtectedRoute>
        } />

        {/* Admin-Only Routes */}
        <Route path="/AdminDashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/CourseList" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CourseList/>
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseName/topics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <TopicList />
          </ProtectedRoute>
        } />
        <Route path="/courses/:courseName/questions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <QuestionList />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminAnalytics />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
