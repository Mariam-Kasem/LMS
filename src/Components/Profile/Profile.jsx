import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ⚠️ استبدلي الرابط برابط السيرفر بتاعك الحقيقي
const BACKEND_URL = 'https://physics-lms-backend.vercel.app';

export default function Profile({ user }) {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [profileData, setProfileData] = useState(user || storedUser);
  const [loading, setLoading] = useState(false);

  // 1. جلب أحدث بيانات المستخدم والامتحانات من قاعدة البيانات
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data) {
          setProfileData(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 2. قراءة الامتحانات القادمة من الـ Database (MongoDB)
  // سواء كانت مصفوفة (Array) أو Object مسجل داخل الـ User
  const rawExams = profileData?.exams || profileData?.examScores || [];

  const examHistory = Array.isArray(rawExams)
    ? rawExams.map((item, index) => {
        const percentage = Math.round((item.score / item.total) * 100);
        let status = 'مقبول';
        if (percentage >= 85) status = 'ممتاز';
        else if (percentage >= 75) status = 'جيد جداً';
        else if (percentage >= 60) status = 'جيد';

        return {
          id: item.examId || index,
          title: item.examTitle || item.title || `اختبار تجريبي #${index + 1}`,
          date: item.date ? new Date(item.date).toLocaleDateString('ar-EG') : 'حديثاً',
          score: `${item.score} / ${item.total}`,
          status
        };
      })
    : Object.keys(rawExams).map((key, index) => {
        const item = rawExams[key];
        const percentage = Math.round((item.score / item.total) * 100);
        let status = 'مقبول';
        if (percentage >= 85) status = 'ممتاز';
        else if (percentage >= 75) status = 'جيد جداً';
        else if (percentage >= 60) status = 'جيد';

        return {
          id: key,
          title: item.title || `اختبار #${index + 1}`,
          date: item.date || 'حديثاً',
          score: `${item.score} / ${item.total}`,
          status
        };
      });

  const studentData = {
    name: profileData?.name || 'مريم قاسم الدسوقي',
    phone: profileData?.phone || '01091574102',
    parentPhone: profileData?.parentPhone || profileData?.guardianPhone || '01198765432',
    code: profileData?.code || 'PHY-002857',
    grade: profileData?.grade || 'الصف الثالث الثانوي',
    governorate: profileData?.governorate || 'القاهرة',
    attendanceRate: examHistory.length > 0 ? '100%' : '0%',
    completedExamsCount: examHistory.length
  };

  return (
    <div dir="rtl" className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* شريط العنوان وزر الرجوع */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 text-dark">الملف الشخصي وتقارير الأداء</h4>
          <button 
            onClick={() => navigate('/home')} 
            className="btn btn-outline-secondary btn-sm px-3 fw-bold rounded-3"
          >
            ← العودة للرئيسية
          </button>
        </div>

        {/* بطاقة معلومات الطالب من الداتابيز */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <div className="row align-items-center g-3">
            <div className="col-auto">
              <div 
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fs-2 fw-bold shadow-sm" 
                style={{ width: '70px', height: '70px' }}
              >
                {studentData.name.trim().charAt(0)}
              </div>
            </div>
            <div className="col">
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold mb-1 text-dark">{studentData.name}</h5>
                {loading && <span className="spinner-border spinner-border-sm text-primary"></span>}
              </div>
              <div className="d-flex flex-wrap gap-2 align-items-center small text-muted">
                <span>كود الطالب: <strong className="text-primary">{studentData.code}</strong></span>
                <span>•</span>
                <span className="badge bg-light text-secondary border">{studentData.grade}</span>
              </div>
            </div>
          </div>

          <hr className="my-3 text-secondary opacity-25" />

          {/* تفاصيل البيانات الشخصية */}
          <div className="row g-3 small">
            <div className="col-6 col-md-3">
              <span className="text-muted d-block mb-1">رقم هاتف الطالب:</span>
              <span className="fw-bold text-dark">{studentData.phone}</span>
            </div>
            <div className="col-6 col-md-3">
              <span className="text-muted d-block mb-1">رقم ولي الأمر:</span>
              <span className="fw-bold text-dark">{studentData.parentPhone}</span>
            </div>
            <div className="col-6 col-md-3">
              <span className="text-muted d-block mb-1">المحافظة:</span>
              <span className="fw-bold text-dark">{studentData.governorate}</span>
            </div>
            <div className="col-6 col-md-3">
              <span className="text-muted d-block mb-1">نسبة الحضور:</span>
              <span className="fw-bold text-primary">{studentData.attendanceRate}</span>
            </div>
          </div>
        </div>

        {/* كشف درجات الامتحانات (ديناميكي من الداتابيز) */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-dark">سجل درجات الامتحانات والواجبات</h5>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
              عدد الاختبارات المكتملة: {studentData.completedExamsCount}
            </span>
          </div>

          {examHistory.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="py-3">عنوان الامتحان</th>
                    <th className="py-3">تاريخ الإجراء</th>
                    <th className="py-3">الدرجة</th>
                    <th className="py-3">التقدير</th>
                  </tr>
                </thead>
                <tbody>
                  {examHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-bold text-dark py-3">{item.title}</td>
                      <td className="text-muted small py-3">{item.date}</td>
                      <td className="fw-bold text-primary py-3">{item.score}</td>
                      <td className="py-3">
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 border rounded-3 bg-light bg-opacity-50">
              <i className="bi bi-journal-x fs-1 text-muted d-block mb-2"></i>
              <h6 className="fw-bold text-dark mb-1">لم تقم بأداء أي امتحانات حتى الآن</h6>
              <p className="text-muted small mb-3">ابدأ بحل أول كويز في منهج الفيزياء لتسجيل درجاتك وتقييم مستواك هنا.</p>
              <button 
                onClick={() => navigate('/exam')} 
                className="btn btn-primary btn-sm px-4 py-2 fw-bold rounded-3 shadow-sm"
              >
                الانتقال للامتحانات الآن
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}