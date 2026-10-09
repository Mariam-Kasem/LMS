import React, { useState } from 'react';

// أيقونات SVG نظيفة ومباشرة
const AtomIcon = () => (
  <svg style={{ width: 34, height: 34, color: '#090d16' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
  </svg>
);

const ShieldIcon = () => (
  <svg style={{ width: 22, height: 22, color: '#818cf8', flexShrink: 0, marginTop: 2 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default function Auth({ onAuthSuccess }) {
  // التبديل بين تسجيل الدخول وإنشاء حساب
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // بيانات تسجيل الدخول
  const [role, setRole] = useState('student');
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
  const handleLoginSubmit = (e) => {
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
    setTimeout(() => {
      setLoading(false);
      if (onAuthSuccess) {
        onAuthSuccess({ phone: loginPhone, role, name: 'أحمد محمد' });
      } else {
        alert('تم تسجيل الدخول بنجاح!');
      }
    }, 1000);
  };

  // معالجة إنشاء الحساب
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { fullName, studentPhone, parentPhone, password, confirmPassword } = formData;

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
    setTimeout(() => {
      setLoading(false);
      alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      setMode('login');
      setLoginPhone(studentPhone);
    }, 1200);
  };

  return (
    <div dir="rtl" style={styles.container}>
      <div style={styles.card}>
        
        {/* اللوجو والعنوان */}
        <div style={styles.header}>
          <div style={styles.logoBadge}>
            <AtomIcon />
          </div>
          <h1 style={styles.title}>منصة فيزياء المستقبل</h1>
          <p style={styles.subtitle}>
            {mode === 'login'
              ? 'سجل دخولك لمتابعة المحاضرات، الكويزات، وحصص البث المباشر'
              : 'أنشئ حسابك الجديد وانضم لرحلة التفوق في مادة الفيزياء'}
          </p>
        </div>

        {/* أزرار التبديل العلوية */}
        <div style={styles.modeTabs}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{ ...styles.modeBtn, ...(mode === 'login' ? styles.activeModeBtn : {}) }}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{ ...styles.modeBtn, ...(mode === 'register' ? styles.activeModeBtn : {}) }}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* صندوق الخطأ */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* ================= فورم تسجيل الدخول ================= */}
        {mode === 'login' ? (
          <>
            <div style={styles.roleTabs}>
              {[
                { id: 'student', label: 'طالب' },
                { id: 'parent', label: 'ولي أمر' },
                { id: 'assistant', label: 'مساعد' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setRole(item.id); setError(''); }}
                  style={{ ...styles.roleBtn, ...(role === item.id ? styles.activeRoleBtn : {}) }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleLoginSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>رقم الهاتف المسجل</label>
                <input
                  type="tel"
                  placeholder="مثال: ٠١٠١٢٣٤٥٦٧٨"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.passHeader}>
                  <label style={styles.label}>كلمة المرور</label>
                  <a href="#forgot" style={styles.forgotLink}>نسيت كلمة المرور؟</a>
                </div>
                
                {/* حقل كلمة المرور بزر مستقل لمنع التداخل */}
                <div style={styles.passInputContainer}>
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={styles.innerInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    style={styles.toggleBtn}
                  >
                    {showLoginPass ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>

              <div style={styles.checkWrapper}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <label htmlFor="remember" style={styles.checkLabel}>تذكر تسجيل دخولي على هذا الجهاز</label>
              </div>

              <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? 'جاري التحقق...' : 'دخول إلى المنصة'}
              </button>
            </form>

            <div style={styles.footerNote}>
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                style={styles.switchLink}
              >
                اضغط هنا لإنشاء حساب جديد
              </button>
            </div>
          </>
        ) : (
          /* ================= فورم إنشاء حساب جديد ================= */
          <form onSubmit={handleRegisterSubmit} style={styles.form}>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>اسم الطالب (ثلاثي أو رباعي) *</label>
              <input
                type="text"
                placeholder="مثال: أحمد محمد علي حسن"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.twoCols}>
              <div style={styles.formGroup}>
                <label style={styles.label}>رقم هاتف الطالب *</label>
                <input
                  type="tel"
                  placeholder="مثال: ٠١٠xxxxxxxx"
                  value={formData.studentPhone}
                  onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>رقم هاتف ولي الأمر *</label>
                <input
                  type="tel"
                  placeholder="مثال: ٠١١xxxxxxxx"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.twoCols}>
              <div style={styles.formGroup}>
                <label style={styles.label}>الصف الدراسي *</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  style={styles.select}
                >
                  <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                  <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                  <option value="الصف الثالث الثانوي">الصف الثالث الثانوي</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>المحافظة *</label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  style={styles.select}
                >
                  {['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية', 'البحيرة', 'الغربية', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'بني سويف', 'الفيوم', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'أخرى'].map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.twoCols}>
              <div style={styles.formGroup}>
                <label style={styles.label}>كلمة المرور *</label>
                <div style={styles.passInputContainer}>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    placeholder="لا تقل عن ٦ خانات"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={styles.innerInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    style={styles.toggleBtn}
                  >
                    {showRegPass ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>تأكيد كلمة المرور *</label>
                <div style={styles.passInputContainer}>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={styles.innerInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={styles.toggleBtn}
                  >
                    {showConfirmPass ? 'إخفاء' : 'إظهار'}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'جاري إنشاء الحساب...' : 'تأكيد التسجيل وإنشاء الحساب'}
            </button>

            <div style={styles.footerNote}>
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                style={styles.switchLink}
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        )}

        {/* تنبيه الأمان */}
        <div style={styles.securityBox}>
          <ShieldIcon />
          <span>
            <strong style={{ color: '#ffffff' }}>تنبيه أمان المنصة:</strong> يتم ربط الحساب بجهاز واحد فقط تلقائياً. يرجى التسجيل من جهازك الأساسي الذي ستعتمد عليه لحضور الحصص لتجنب إيقاف الحساب.
          </span>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9', // خلفية رمادية فاتحة ونظيفة
    padding: '30px 16px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Cairo", sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '640px',
    backgroundColor: '#ffffff', // كارت أبيض نقي
    borderRadius: '28px',
    border: '1.5px solid #e2e8f0',
    padding: '40px 36px',
    boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
    color: '#0f172a',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '26px',
  },
  logoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', // أزرق تعليمي احترافي
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)',
    marginBottom: '14px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    margin: '0 0 6px 0',
    color: '#0f172a', // كحلي غامق وواضح للقراءة
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.6',
  },
  modeTabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    backgroundColor: '#f8fafc',
    padding: '6px',
    borderRadius: '16px',
    border: '1.5px solid #e2e8f0',
    marginBottom: '24px',
  },
  modeBtn: {
    padding: '12px 0',
    fontSize: '15px',
    fontWeight: '700',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  activeModeBtn: {
    backgroundColor: '#ffffff',
    color: '#2563eb',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
  },
  roleTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    backgroundColor: '#f8fafc',
    padding: '6px',
    borderRadius: '16px',
    border: '1.5px solid #e2e8f0',
    marginBottom: '24px',
  },
  roleBtn: {
    padding: '12px 0',
    fontSize: '14px',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  activeRoleBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
  },
  errorBox: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: '#fef2f2',
    border: '1.5px solid #fecaca',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '20px',
    lineHeight: 1.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  twoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    textAlign: 'right',
    transition: 'border-color 0.2s, background-color 0.2s',
  },
  passInputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1.5px solid #cbd5e1',
    borderRadius: '14px',
    padding: '0 12px',
    boxSizing: 'border-box',
  },
  innerInput: {
    flex: 1,
    padding: '14px 0',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#0f172a',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    textAlign: 'right',
  },
  toggleBtn: {
    background: '#e2e8f0',
    border: 'none',
    color: '#1e293b',
    fontWeight: '700',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    flexShrink: 0,
    marginRight: '8px',
    transition: 'background 0.2s',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1.5px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  passHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: '13px',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
  },
  checkWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#2563eb',
    cursor: 'pointer',
  },
  checkLabel: {
    fontSize: '13px',
    color: '#475569',
    cursor: 'pointer',
  },
  submitBtn: {
    marginTop: '6px',
    padding: '15px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 8px 18px rgba(37, 99, 235, 0.25)',
  },
  footerNote: {
    marginTop: '10px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  securityBox: {
    marginTop: '26px',
    padding: '14px 16px',
    borderRadius: '16px',
    backgroundColor: '#eff6ff', // أزرق سماوي ناعم ومريح
    border: '1.5px solid #bfdbfe',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '13px',
    color: '#1e40af',
    lineHeight: '1.6',
  },
};