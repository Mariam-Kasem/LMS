import React, { useState } from 'react';
import Auth from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Home from './Components/Home/Home';
import LessonView from './Components/LessonView/LessonView';
import ExamArena from './Components/ExamArena/ExamArena';
import Profile from './Components/Profile/Profile';
import Dashboard from './Components/Dashboard/Dashboard';
import Footer from './Components/Footer/Footer';

export default function App() {
  const [user, setUser] = useState({ name: 'أحمد محمد علي', phone: '01012345678', role: 'student' });
  const [currentView, setCurrentView] = useState('home');

  // إذا لم يكن مسجلاً، تظهر شاشة تسجيل الدخول فقط بدون ناف بار أو فوتر
  if (!user) {
    return <Auth onAuthSuccess={(userData) => { setUser(userData); setCurrentView('home'); }} />;
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* الناف بار ثابت في قمة كل الصفحات */}
      <Nav 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        user={user} 
        onLogout={() => setUser(null)} 
      />

      {/* محتوى الصفحة النشطة يتمدد ليشغل المساحة المتبقية */}
      <main className="flex-grow-1">
        {currentView === 'home' && (
          <Home 
            onOpenLesson={() => setCurrentView('lesson')}
            onOpenExam={() => setCurrentView('exam')}
            onOpenProfile={() => setCurrentView('profile')}
          />
        )}

        {currentView === 'lesson' && (
          <LessonView 
            onBack={() => setCurrentView('home')} 
            onCompleteLesson={() => { alert('تم تحديث نسبة تقدمك!'); setCurrentView('home'); }}
          />
        )}

        {currentView === 'exam' && (
          <ExamArena onExit={() => setCurrentView('home')} />
        )}

        {currentView === 'profile' && (
          <Profile onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'admin' && (
          <Dashboard onExit={() => setCurrentView('home')} />
        )}
      </main>

      {/* الفوتر في نهاية كل الصفحات */}
      <Footer />
    </div>
  );
}