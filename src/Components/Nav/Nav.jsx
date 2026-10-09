import React from 'react';

export default function Nav({ currentView, setCurrentView, user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2 px-3 px-md-4 sticky-top" dir="rtl">
      <div className="container-fluid">
        
        {/* اللوجو واسم المنصة */}
        <div 
          className="d-flex align-items-center gap-2 cursor-pointer" 
          onClick={() => setCurrentView('home')} 
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3 shadow-sm"
            style={{ width: '42px', height: '42px' }}
          >
            <i className="bi bi-atom fs-3"></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold text-dark">منصة فيزياء المستقبل</h5>
            <small className="text-muted" style={{ fontSize: '11px' }}>الصف الثالث الثانوي</small>
          </div>
        </div>

        {/* أزرار التنقل الأساسية */}
        <div className="d-flex align-items-center bg-light p-1 rounded-4 border mx-auto my-2 my-lg-0">
          <button 
            type="button" 
            onClick={() => setCurrentView('home')} 
            className={`btn btn-sm rounded-3 px-3 fw-bold ${currentView === 'home' ? 'btn-primary shadow-sm' : 'text-secondary'}`}
          >
            الرئيسية
          </button>
          <button 
            type="button" 
            onClick={() => setCurrentView('lesson')} 
            className={`btn btn-sm rounded-3 px-3 fw-bold ${currentView === 'lesson' ? 'btn-primary shadow-sm' : 'text-secondary'}`}
          >
            صفحة الدرس
          </button>
          <button 
            type="button" 
            onClick={() => setCurrentView('exam')} 
            className={`btn btn-sm rounded-3 px-3 fw-bold ${currentView === 'exam' ? 'btn-primary shadow-sm' : 'text-secondary'}`}
          >
            الامتحان
          </button>
          <button 
            type="button" 
            onClick={() => setCurrentView('profile')} 
            className={`btn btn-sm rounded-3 px-3 fw-bold ${currentView === 'profile' ? 'btn-primary shadow-sm' : 'text-secondary'}`}
          >
            الملف الشخصي
          </button>
          <button 
            type="button" 
            onClick={() => setCurrentView('admin')} 
            className={`btn btn-sm rounded-3 px-3 fw-bold ${currentView === 'admin' ? 'btn-primary shadow-sm' : 'text-secondary'}`}
          >
            لوحة المدرس
          </button>
        </div>

        {/* بيانات الطالب وزر الخروج */}
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 bg-light px-3 py-1 rounded-3 border d-none d-sm-flex">
            <div 
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: '32px', height: '32px', fontSize: '13px' }}
            >
              {user?.name ? user.name.charAt(0) : 'ط'}
            </div>
            <div className="text-end">
              <div className="fw-bold small text-dark mb-0">{user?.name}</div>
              <div className="text-muted" style={{ fontSize: '10px' }}>كود: PHY-3042</div>
            </div>
          </div>

          <button 
            onClick={onLogout} 
            className="btn btn-outline-danger btn-sm px-3 py-1 fw-bold rounded-3 d-flex align-items-center gap-1"
          >
            <i className="bi bi-box-arrow-left"></i>
            <span>خروج</span>
          </button>
        </div>

      </div>
    </nav>
  );
}