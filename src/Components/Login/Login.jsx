import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://physics-lms-backend.vercel.app';

// أيقونات SVG
const AtomIcon = () => (
  <svg 
    className="text-white" 
    style={{ width: '32px', height: '32px' }} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
  </svg>
);

const ShieldIcon = () => (
  <svg 
    className="text-primary flex-shrink-0 mt-1" 
    style={{ width: '22px', height: '22px' }} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default function Auth({ onAuthSuccess }) {
  const navigate = useNavigate();

  // التبديل بين تسجيل الدخول وإنشاء حساب
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // بيانات تسجيل الدخول
  const [role, setRole] = useState('student'); // 'student' | 'parent' | 'teacher'
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // بيانات إنشاء الحساب الجديد
  const [formData, setFormData] = useState({
    fullName: '',
    studentPhone: '',
    parentPhone: '',
    grade: 'الصف الثالث الثانوي',
    governorate: 'القاهرة',
    password: '',
    confirmPassword: '',
  });
  const [showRegPass, setShowRegPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // الحالة العامة
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhone = (num) => /^01[0125][0-9]{8}$/.test(num.trim());

  // معالجة تسجيل الدخول
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginPhone || !loginPassword) {
      setError('من فضلك أدخل رقم الهاتف وكلمة المرور.');
      return;
    }
    if (!validatePhone(loginPhone)) {
      setError('يرجى إدخال رقم هاتف محمول مصري صحيح يبدأ بـ (010، 011، 012، 015) ومكون من 11 رقماً.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { 
        phone: loginPhone,
        password: loginPassword,
      });

      const userData = response.data;

      // إذا كان التبويب المختار هو "المعلم" ولكن الحساب ليس أدمن
      if (role === 'teacher' && userData.role !== 'admin') {
        setError('⛔ عفواً، هذا الحساب ليس له صلاحيات المعلم. يرجى الدخول من تبويب طالب.');
        setLoading(false);
        return;
      }

      // إذا كان الحساب معلماً لكنه يحاول الدخول من تبويب الطالب
      if (role === 'student' && userData.role === 'admin') {
        setError('👨‍🏫 أهلاً يا أستاذنا، يرجى تسجيل الدخول من تبويب "المعلم".');
        setLoading(false);
        return;
      }

      // حفظ الجلسة
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);

      if (onAuthSuccess) {
        onAuthSuccess(userData);
      }

      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }

    } catch (err) {
      const msg = err.response?.data?.message || 'تعذر تسجيل الدخول، يرجى التأكد من البيانات أو تشغيل السيرفر.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // معالجة إنشاء الحساب
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { fullName, studentPhone, parentPhone, grade, governorate, password, confirmPassword } = formData;

    if (!fullName || !studentPhone || !parentPhone || !password || !confirmPassword) {
      setError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    if (fullName.trim().split(' ').length < 3) {
      setError('يرجى كتابة الاسم ثلاثياً على الأقل.');
      return;
    }

    if (!validatePhone(studentPhone)) {
      setError('رقم هاتف الطالب غير صحيح، يجب أن يتكون من 11 رقماً.');
      return;
    }

    if (!validatePhone(parentPhone)) {
      setError('رقم هاتف ولي الأمر غير صحيح، يجب أن يتكون من 11 رقماً.');
      return;
    }

    if (studentPhone === parentPhone) {
      setError('لا يمكن أن يكون رقم هاتف الطالب هو نفسه رقم هاتف ولي الأمر.');
      return;
    }

    if (password.length < 6) {
      setError('يجب ألا تقل كلمة المرور عن 6 أحرف أو أرقام.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);
    try {
      // تم التعديل إلى رابط Vercel بدلاً من localhost:5000
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: fullName,
        phone: studentPhone,
        parentPhone,
        grade,
        governorate,
        password,
      });

      alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      setMode('login');
      setLoginPhone(studentPhone);
      setFormData({
        fullName: '',
        studentPhone: '',
        parentPhone: '',
        grade: 'الصف الثالث الثانوي',
        governorate: 'القاهرة',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب، تأكد من الاتصال بالسيرفر.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
      <div className="card shadow-sm border rounded-4 w-100 p-4 p-md-5" style={{ maxWidth: '640px' }}>
        
        {/* اللوجو والعنوان */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center bg-primary rounded-4 shadow-sm mb-3" 
            style={{ width: '64px', height: '64px' }}
          >
            <AtomIcon />
          </div>
          <h1 className="h3 fw-bold text-dark mb-2">منصة فيزياء المستقبل</h1>
          <p className="text-secondary small mb-0 lh-base">
            {mode === 'login'
              ? 'سجل دخولك لمتابعة المحاضرات، الكويزات، وحصص البث المباشر'
              : 'أنشئ حسابك الجديد وانضم لرحلة التفوق في مادة الفيزياء'}
          </p>
        </div>

        {/* أزرار التبديل العلوية */}
        <div className="row g-2 bg-light p-1 rounded-3 border mb-4">
          <div className="col-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`btn w-100 py-2 fw-bold rounded-3 ${
                mode === 'login' ? 'btn-white bg-white text-primary shadow-sm' : 'text-secondary border-0'
              }`}
            >
              تسجيل الدخول
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`btn w-100 py-2 fw-bold rounded-3 ${
                mode === 'register' ? 'btn-white bg-white text-primary shadow-sm' : 'text-secondary border-0'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>

        {/* صندوق الخطأ */}
        {error && (
          <div className="alert alert-danger py-2 px-3 rounded-3 small mb-4 lh-base" role="alert">
            {error}
          </div>
        )}

        {/* فورم تسجيل الدخول */}
        {mode === 'login' ? (
          <>
            <div className="row g-2 bg-light p-1 rounded-3 border mb-4">
              {[
                { id: 'student', label: 'طالب' },
                { id: 'parent', label: 'ولي أمر' },
                { id: 'teacher', label: 'المعلم 👨‍🏫' },
              ].map((item) => (
                <div key={item.id} className="col-4">
                  <button
                    type="button"
                    onClick={() => { setRole(item.id); setError(''); }}
                    className={`btn w-100 py-2 fw-bold rounded-3 small ${
                      role === item.id 
                        ? item.id === 'teacher' ? 'btn-dark text-warning shadow-sm' : 'btn-primary shadow-sm' 
                        : 'text-secondary border-0'
                    }`}
                  >
                    {item.label}
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleLoginSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-bold text-secondary mb-1">
                  {role === 'teacher' ? 'رقم هاتف المعلم' : 'رقم الهاتف المسجل'}
                </label>
                <input
                  type="tel"
                  placeholder="مثال: ٠١٠١٢٣٤٥٦٧٨"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="form-control form-control-lg fs-6 rounded-3"
                />
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary mb-0">كلمة المرور</label>
                  {role !== 'teacher' && (
                    <button 
                      type="button"
                      onClick={() => alert('يرجى التواصل مع المساعد أو الدعم الفني لاستعادة كلمة المرور.')}
                      className="btn btn-link p-0 small text-primary text-decoration-none fw-semibold"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                
                <div className="input-group">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="form-control form-control-lg fs-6 rounded-start-3 rounded-end-0 border-end-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="btn btn-outline-secondary border-start-0 rounded-end-3 rounded-start-0 px-3 fw-bold small"
                  >
                    {showLoginPass ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>

              <div className="form-check d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-check-input m-0"
                />
                <label htmlFor="remember" className="form-check-label small text-muted">
                  تذكر تسجيل دخولي على هذا الجهاز
                </label>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className={`btn btn-lg rounded-3 fw-bold shadow-sm mt-2 ${
                  role === 'teacher' ? 'btn-dark text-warning' : 'btn-primary'
                }`}
              >
                {loading ? 'جاري التحقق...' : (role === 'teacher' ? 'دخول لوحة تحكم المعلم' : 'دخول إلى المنصة')}
              </button>
            </form>

            <div className="text-center small text-secondary mt-3">
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className="btn btn-link p-0 text-primary fw-bold text-decoration-underline small"
              >
                اضغط هنا لإنشاء حساب جديد
              </button>
            </div>
          </>
        ) : (
          /* فورم إنشاء حساب جديد */
          <form onSubmit={handleRegisterSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-bold text-secondary mb-1">اسم الطالب (ثلاثي أو رباعي) *</label>
              <input
                type="text"
                placeholder="مثال: أحمد محمد علي حسن"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="form-control form-control-lg fs-6 rounded-3"
              />
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-secondary mb-1">رقم هاتف الطالب *</label>
                <input
                  type="tel"
                  placeholder="مثال: ٠١٠xxxxxxxx"
                  value={formData.studentPhone}
                  onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                  className="form-control form-control-lg fs-6 rounded-3"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-secondary mb-1">رقم هاتف ولي الأمر *</label>
                <input
                  type="tel"
                  placeholder="مثال: ٠١١xxxxxxxx"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="form-control form-control-lg fs-6 rounded-3"
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-secondary mb-1">الصف الدراسي *</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="form-select form-select-lg fs-6 rounded-3"
                >
                  <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-secondary mb-1">المحافظة *</label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="form-select form-select-lg fs-6 rounded-3"
                >
                  {['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية', 'البحيرة', 'الغربية', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'بني سويف', 'الفيوم', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'أخرى'].map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-secondary mb-1">كلمة المرور *</label>
                <div className="input-group">
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    placeholder="لا تقل عن ٦ خانات"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-control form-control-lg fs-6 rounded-start-3 rounded-end-0 border-end-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="btn btn-outline-secondary border-start-0 rounded-end-3 rounded-start-0 px-3 fw-bold small"
                  >
                    {showRegPass ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-secondary mb-1">تأكيد كلمة المرور *</label>
                <div className="input-group">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="form-control form-control-lg fs-6 rounded-start-3 rounded-end-0 border-end-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="btn btn-outline-secondary border-start-0 rounded-end-3 rounded-start-0 px-3 fw-bold small"
                  >
                    {showConfirmPass ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg rounded-3 fw-bold shadow-sm mt-2">
              {loading ? 'جاري إنشاء الحساب...' : 'تأكيد التسجيل وإنشاء الحساب'}
            </button>

            <div className="text-center small text-secondary mt-3">
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="btn btn-link p-0 text-primary fw-bold text-decoration-underline small"
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        )}

        {/* تنبيه الأمان */}
        <div className="alert alert-info border-info-subtle bg-info-subtle d-flex gap-2 align-items-start rounded-4 mt-4 mb-0 py-3 px-3">
          <ShieldIcon />
          <span className="small text-info-emphasis lh-base">
            <strong className="text-dark">تنبيه أمان المنصة:</strong> يتم ربط الحساب بجهاز واحد فقط تلقائياً. يرجى التسجيل من جهازك الأساسي الذي ستعتمد عليه لحضور الحصص لتجنب إيقاف الحساب.
          </span>
        </div>

      </div>
    </div>
  );
}