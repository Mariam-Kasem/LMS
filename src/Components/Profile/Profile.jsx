import React from 'react';

export default function Profile({ onBack }) {
  const studentData = {
    name: 'أحمد محمد علي',
    phone: '01012345678',
    parentPhone: '01198765432',
    code: 'PHY-3042',
    grade: 'الصف الثالث الثانوي',
    governorate: 'القاهرة',
    attendanceRate: '94%',
    completedExams: 6,
    avgScore: '88%'
  };

  const examHistory = [
    { id: 1, title: 'امتحان الفصل الأول الشامل', date: '2026-10-01', score: '28 / 30', status: 'ممتاز' },
    { id: 2, title: 'كويز أجهزة القياس والجلفانومتر', date: '2026-09-24', score: '18 / 20', status: 'جيد جداً' },
    { id: 3, title: 'امتحان تجريبي: دوائر التيار المستمر', date: '2026-09-15', score: '25 / 30', status: 'جيد' }
  ];

  return (
    <div dir="rtl" className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">الملف الشخصي وتقارير الأداء</h4>
          <button onClick={onBack} className="btn btn-outline-secondary btn-sm px-3 fw-bold">
            <i className="bi bi-arrow-right me-1"></i> العودة
          </button>
        </div>

        {/* بطاقة معلومات الطالب */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fs-2 fw-bold" style={{ width: 70, height: 70 }}>
                {studentData.name.charAt(0)}
              </div>
            </div>
            <div className="col">
              <h5 className="fw-bold mb-1">{studentData.name}</h5>
              <div className="text-muted small">كود المنصة: <span className="fw-bold text-primary">{studentData.code}</span> • {studentData.grade}</div>
            </div>
          </div>

          <hr className="my-3 text-secondary opacity-25" />

          <div className="row g-3 small">
            <div className="col-sm-6 col-md-3">
              <span className="text-muted d-block">رقم الطالب:</span>
              <span className="fw-bold">{studentData.phone}</span>
            </div>
            <div className="col-sm-6 col-md-3">
              <span className="text-muted d-block">رقم ولي الأمر:</span>
              <span className="fw-bold">{studentData.parentPhone}</span>
            </div>
            <div className="col-sm-6 col-md-3">
              <span className="text-muted d-block">المحافظة:</span>
              <span className="fw-bold">{studentData.governorate}</span>
            </div>
            <div className="col-sm-6 col-md-3">
              <span className="text-muted d-block">نسبة الحضور:</span>
              <span className="fw-bold text-success">{studentData.attendanceRate}</span>
            </div>
          </div>
        </div>

        {/* كشف درجات الامتحانات */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h5 className="fw-bold mb-3">سجل درجات الامتحانات والواجبات</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>عنوان الامتحان</th>
                  <th>تاريخ الإجراء</th>
                  <th>الدرجة</th>
                  <th>التقدير</th>
                </tr>
              </thead>
              <tbody>
                {examHistory.map(item => (
                  <tr key={item.id}>
                    <td className="fw-bold">{item.title}</td>
                    <td className="text-muted small">{item.date}</td>
                    <td className="fw-bold text-primary">{item.score}</td>
                    <td><span className="badge bg-success-subtle text-success">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}