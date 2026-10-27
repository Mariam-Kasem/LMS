import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Auth from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Home from './Components/Home/Home';
import LessonView from './Components/LessonView/LessonView';
import ExamArena from './Components/ExamArena/ExamArena';
import Profile from './Components/Profile/Profile';
import Footer from './Components/Footer/Footer';
import Admin from './Components/Admin/Admin';

// مكون تغليف الصفحة الرئيسية والمسارات المحمية
function MainLayout({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* الناف بار */}
      <Nav 
        user={user} 
        onLogout={onLogout} 
      />

      {/* المحتوى الداخلي المتغير بحسب الرابط */}
      <main className="flex-grow-1">
        <Routes>
          <Route 
            path="/home" 
            element={
              <Home 
                user={user}
                onOpenLesson={() => navigate('/lesson')}
                onOpenExam={() => navigate('/exam')}
                onOpenProfile={() => navigate('/profile')}
              />
            } 
          />

          <Route 
            path="/lesson" 
            element={
              <LessonView 
                onBack={() => navigate('/home')} 
                onCompleteLesson={() => {
                  alert('تم تحديث نسبة تقدمك!');
                  navigate('/home');
                }}
              />
            } 
          />

          <Route 
            path="/exam" 
            element={<ExamArena onExit={() => navigate('/home')} />} 
          />

          <Route 
            path="/profile" 
            element={<Profile onBack={() => navigate('/home')} />} 
          />

          {/* مسار الأدمن مخصص للمستخدمين الذين يملكون رتبة admin فقط */}
          <Route 
            path="/admin" 
            element={
              user?.role === 'admin' ? (
                <Admin onExit={() => navigate('/home')} />
              ) : (
                <Navigate to="/home" replace />
              )
            } 
          />

          {/* التوجيه الافتراضي لأي مسار غير معروف */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* الفوتر */}
      <Footer />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <HashRouter>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route 
          path="/login" 
          element={
            !user ? (
              <Auth onAuthSuccess={(userData) => setUser(userData)} />
            ) : (
              <Navigate to="/home" replace />
            )
          } 
        />

        {/* باقي مسارات المنصة (محمية بتسجيل الدخول) */}
        <Route 
          path="/*" 
          element={
            user ? (
              <MainLayout user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
}