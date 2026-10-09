import React, { useState } from 'react';

export default function Home({ onLogout }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);

  const student = {
    name: 'أحمد محمد علي',
    code: 'PHY-3042',
    progress: 75
  };

  const lectures = [
    { id: 1, title: 'المحاضرة 1: قانون أوم والمقاومة النوعية والتوصيلية', duration: '1:20:00' },
    { id: 2, title: 'المحاضرة 2: توصيل المقاومات وحساب المقاومة المكافئة', duration: '1:45:30' },
    { id: 3, title: 'المحاضرة 3: قانون كيرشوف الأول والثاني وتطبيقات معقدة', duration: '1:30:15' },
  ];

  return (
    <div dir="rtl" className="bg-light min-vh-100">
      
   
      {/* Main Content */}
      <div className="container py-4">

        {/* كارت الترحيب ونسبة الإنجاز */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="row align-items-center g-3">
            <div className="col-md-7">
              <h4 className="fw-bold text-dark mb-1">مرحباً بك يا {student.name.split(' ')[0]} 👋</h4>
              <p className="text-muted mb-0">واصل متابعة حصصك، لقد أكملت <span className="text-primary fw-bold">{student.progress}%</span> من المنهج.</p>
            </div>
            <div className="col-md-5">
              <div className="d-flex justify-content-between mb-1 fw-bold small">
                <span>نسبة الإنجاز الإجمالية</span>
                <span className="text-primary">{student.progress}%</span>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style={{ width: `${student.progress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* بنر حصة زوم */}
        <div className="card border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-4 p-3 mb-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge bg-danger mb-1">بث مباشر اليوم</span>
              <h5 className="fw-bold text-dark mb-1">حصة حل المسائل المتقدمة وقوانين كيرشوف</h5>
              <small className="text-muted">الموعد: اليوم الساعة 8:00 مساءً عبر Zoom</small>
            </div>
            <button onClick={() => setShowZoomModal(true)} className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm">
              <i className="bi bi-camera-video me-1"></i> رابط البث المباشر
            </button>
          </div>
        </div>

        {/* قسم المحاضرات والامتحانات */}
        <div className="row g-4">
          
          {/* المحاضرات المسجلة */}
          <div className="col-lg-7">
            <h5 className="fw-bold mb-3">المحاضرات المسجلة</h5>
            <div className="d-flex flex-column gap-3">
              {lectures.map((lec) => (
                <div key={lec.id} className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light p-2 rounded-3 text-primary">
                        <i className="bi bi-play-circle fs-3"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{lec.title}</h6>
                        <small className="text-muted">المدة: {lec.duration}</small>
                      </div>
                    </div>
                    <button onClick={() => setActiveVideo(lec)} className="btn btn-outline-primary btn-sm px-3 fw-bold">
                      مشاهدة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الامتحانات والملفات */}
          <div className="col-lg-5">
            <h5 className="fw-bold mb-3">الامتحانات والملفات</h5>
            
            {/* امتحان إلكتروني */}
            <div className="card border-warning border-opacity-50 bg-warning bg-opacity-10 rounded-3 p-3 mb-3">
              <span className="badge bg-warning text-dark align-self-start mb-2">امتحان إلكتروني</span>
              <h6 className="fw-bold mb-1">كويز شامل على قانوني كيرشوف</h6>
              <small className="text-muted mb-3 d-block">المدة: 30 دقيقة | تصحيح إلكتروني فوري</small>
              <button onClick={() => alert('جاري فتح الامتحان الإلكتروني...')} className="btn btn-warning text-dark fw-bold btn-sm w-100">
                بدء الامتحان
              </button>
            </div>

            {/* ملزمة PDF */}
            <div className="card border-0 shadow-sm rounded-3 p-3 bg-white d-flex flex-row align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-file-earmark-pdf fs-3 text-danger"></i>
                <div>
                  <h6 className="fw-bold mb-0">ملخص قوانين الفصل الأول.pdf</h6>
                  <small className="text-muted">الحجم: 3.5 ميجا</small>
                </div>
              </div>
              <button onClick={() => alert('جاري تنزيل الملف...')} className="btn btn-light btn-sm fw-bold border">
                تحميل
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* مودال الزوم المباشر */}
      {showZoomModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">تفاصيل بث Zoom</h5>
                <button type="button" className="btn-close" onClick={() => setShowZoomModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small">انضم قبل بدء الحصة بـ 10 دقائق لتجهيز الصوت.</p>
                <div className="bg-light p-3 rounded-3 mb-3 small">
                  <div><strong>معرف الاجتماع (Meeting ID):</strong> 892 4110 5590</div>
                  <div className="mt-1"><strong>كلمة السر (Passcode):</strong> PHY2026</div>
                </div>
                <a href="https://zoom.us" target="_blank" rel="noreferrer" className="btn btn-primary w-100 fw-bold py-2">
                  فتح Zoom والانضمام الآن
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مشغل الفيديو مع العلامة المائية */}
      {activeVideo && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-2">
                <h6 className="modal-title">{activeVideo.title}</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setActiveVideo(null)}></button>
              </div>
              <div className="position-relative bg-black" style={{ aspectRatio: '16/9' }}>
                <video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" controls autoPlay className="w-100 h-100" />
                {/* علامة مائية لحماية الفيديو */}
                <div className="position-absolute text-white opacity-25 fw-bold user-select-none" style={{ top: '25%', left: '25%', pointerEvents: 'none', transform: 'rotate(-15deg)' }}>
                  {student.name} • {student.code}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}