import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Nav({ user, onLogout }) {
  const navigate = useNavigate();

  // روابط شريط التنقل الخاصة بالطلاب فقط
  const studentNavLinks = [
    { path: '/home', label: 'الرئيسية' },
    { path: '/lesson', label: 'صفحة الدرس' },
    { path: '/exam', label: 'الامتحان' },
    { path: '/profile', label: 'الملف الشخصي' }
  ];

  // روابط شريط التنقل الخاصة بالمعلم فقط
  const adminNavLinks = [
    { path: '/admin', label: '⚙️ لوحة الإدارة والتحكم', isAdminBtn: true },
    { path: '/home', label: '👁️ معاينة المنصة كطالب', isAdminBtn: false }
  ];

  const currentLinks = user?.role === 'admin' ? adminNavLinks : studentNavLinks;

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2 px-3 px-md-4 sticky-top" dir="rtl">
      <div className="container-fluid">
        
        {/* اللوجو واسم المنصة */}
        <div 
          className="d-flex align-items-center gap-2" 
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/home')} 
          style={{ cursor: 'pointer' }}
        >
          <div 
            className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 shadow-sm"
            style={{ width: '42px', height: '42px' }}
          >
            <i className="bi bi-atom fs-3"></i>
          </div>
          <div>
            <h5 className="mb-0 fw-bold text-dark">منصة فيزياء المستقبل</h5>
            <small className="text-muted" style={{ fontSize: '11px' }}>
              {user?.role === 'admin' ? 'لوحة تحكم المعلم' : 'الصف الثالث الثانوي'}
            </small>
          </div>
        </div>

        {/* روابط التنقل المخصصة حسب الرتبة */}
        <div className="d-flex align-items-center bg-light p-1 rounded-4 border mx-auto my-2 my-lg-0 flex-wrap justify-content-center gap-1">
          {currentLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => {
                if (user?.role === 'admin') {
                  if (item.isAdminBtn) {
                    return `btn btn-sm rounded-3 px-3 fw-bold text-decoration-none ${
                      isActive ? 'btn-warning shadow-sm text-dark' : 'text-dark border-0'
                    }`;
                  }
                  return `btn btn-sm rounded-3 px-3 fw-bold text-decoration-none ${
                    isActive ? 'btn-secondary text-white shadow-sm' : 'text-secondary border-0'
                  }`;
                }

                // تصميم روابط الطلاب
                return `btn btn-sm rounded-3 px-3 fw-bold text-decoration-none transition-all ${
                  isActive 
                    ? 'btn-primary shadow-sm text-white' 
                    : 'text-secondary border-0'
                }`;
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* بيانات المستخدم وزر تسجيل الخروج */}
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 bg-light px-3 py-1 rounded-3 border d-none d-sm-flex">
            <div 
              className={`${user?.role === 'admin' ? 'bg-warning text-dark' : 'bg-primary text-white'} rounded-circle d-flex align-items-center justify-content-center fw-bold`}
              style={{ width: '32px', height: '32px', fontSize: '13px' }}
            >
              {user?.role === 'admin' ? 'م' : (user?.name ? user.name.charAt(0) : 'ط')}
            </div>
            <div className="text-end">
              <div className="fw-bold small text-dark mb-0 d-flex align-items-center gap-1">
                {user?.name || 'مستخدم'}
                {user?.role === 'admin' && (
                  <span className="badge bg-warning text-dark" style={{ fontSize: '9px' }}>معلم / إدارة</span>
                )}
              </div>
              <div className="text-muted" style={{ fontSize: '10px' }}>
                {user?.role === 'admin' ? 'صلاحيات كاملة' : `كود: ${user?.code || 'PHY-3042'}`}
              </div>
            </div>
          </div>

          <button 
            type="button"
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