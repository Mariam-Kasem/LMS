import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LessonView({ user, onCompleteLesson }) {
  const navigate = useNavigate();

  // بيانات الدروس
  const [lessonsList, setLessonsList] = useState([
    { 
      id: 1, 
      title: 'الدرس 1: شدة التيار وفرق الجهد', 
      duration: '55 دقيقة', 
      completed: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    { 
      id: 2, 
      title: 'الدرس 2: توصيل المقاومات وحساب المكافئة', 
      duration: '1 ساعة و 15 دقيقة', 
      completed: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    { 
      id: 3, 
      title: 'الدرس 3: تطبيق قانوني كيرشوف والمسارات المغلقة', 
      duration: '1 ساعة و 40 دقيقة', 
      completed: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    { 
      id: 4, 
      title: 'الدرس 4: حل مسائل معقدة ومستويات عليا على كيرشوف', 
      duration: '50 دقيقة', 
      completed: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
  ]);

  const [activeLessonId, setActiveLessonId] = useState(3);
  const activeLesson = lessonsList.find((l) => l.id === activeLessonId) || lessonsList[0];

  const [activeTab, setActiveTab] = useState('notes'); // notes | qa | attachments
  const [questions, setQuestions] = useState([
    { 
      id: 1, 
      student: 'أحمد', 
      text: 'هو ليه في قانون كيرشوف التاني بنعوض عن القوة الدافعة الكهربية بالسالب لو عكس اتجاه المسار؟', 
      time: 'منذ ساعتين', 
      reply: 'لأننا بنمشي مع اتجاه هبوط الجهد يا بطل، راجع الدقيقة 24:15 في الفيديو.' 
    }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // إضافة سؤال في منتدى النقاش
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions([
      ...questions,
      { 
        id: Date.now(), 
        student: user?.name ? user.name.split(' ')[0] : 'أنت', 
        text: newQuestion, 
        time: 'الآن', 
        reply: null 
      }
    ]);
    setNewQuestion('');
  };

  // إتمام الدرس الحالي
  const handleMarkComplete = () => {
    setLessonsList((prev) =>
      prev.map((l) => (l.id === activeLessonId ? { ...l, completed: true } : l))
    );
    if (onCompleteLesson) {
      onCompleteLesson();
    } else {
      alert('عاش يا بطل! تم تسجيل اكتمال الدرس بنجاح.');
      navigate('/home');
    }
  };

  // بيانات العلامة المائية للوقاية من تسريب الفيديو
  const watermarkText = `${user?.name || 'طالب المنصة'} • ${user?.code || 'PHY-3042'} • ${user?.phone || '01012345678'}`;

  return (
    <div dir="rtl" className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* شريط الرجوع والعنوان */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button 
            onClick={() => navigate('/home')} 
            className="btn btn-outline-secondary btn-sm px-3 fw-bold rounded-3"
          >
            ← العودة للرئيسية
          </button>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
            الفصل الأول: كهربية • المحاضرات المسجلة
          </span>
        </div>

        <div className="row g-4">
          
          {/* مشغل الفيديو والتبويبات */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
              
              {/* مشغل الفيديو مع العلامة المائية */}
              <div className="position-relative bg-black" style={{ aspectRatio: '16/9' }}>
                <video
                  key={activeLesson.videoUrl}
                  src={activeLesson.videoUrl}
                  controls
                  controlsList="nodownload"
                  className="w-100 h-100"
                />
                <div 
                  className="position-absolute text-white opacity-25 fw-bold user-select-none" 
                  style={{ 
                    top: '35%', 
                    left: '20%', 
                    pointerEvents: 'none', 
                    transform: 'rotate(-12deg)', 
                    fontSize: '15px',
                    letterSpacing: '1px'
                  }}
                >
                  {watermarkText}
                </div>
              </div>

              {/* تفاصيل الدرس وأزرار الإجراء */}
              <div className="p-3 bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h5 className="fw-bold text-dark mb-1">{activeLesson.title}</h5>
                  <small className="text-muted">المدة: {activeLesson.duration}</small>
                </div>
                <button 
                  onClick={handleMarkComplete} 
                  className={`btn btn-sm px-3 fw-bold rounded-3 ${
                    activeLesson.completed ? 'btn-outline-success disabled' : 'btn-success'
                  }`}
                >
                  {activeLesson.completed ? '✓ تم إكمال الدرس' : 'تحديد كمكتمل'}
                </button>
              </div>
            </div>

            {/* التبويبات أسفل الفيديو */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <ul className="nav nav-pills mb-3 border-bottom pb-2">
                <li className="nav-item">
                  <button 
                    className={`nav-link fw-bold ${activeTab === 'notes' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('notes')}
                  >
                    ملخص الدرس
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link fw-bold ${activeTab === 'qa' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('qa')}
                  >
                    أسئلة واستفسارات الطلاب ({questions.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link fw-bold ${activeTab === 'attachments' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('attachments')}
                  >
                    المرفقات والملازم
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === 'notes' && (
                  <div>
                    <h6 className="fw-bold text-primary mb-2">أهم نقاط الحصة:</h6>
                    <ul className="text-secondary small lh-lg mb-0">
                      <li><strong>قانون كيرشوف الأول (حفظ الشحنة):</strong> مجموع التيارات الداخلة لنقطة تفرع يساوي مجموع التيارات الخارجة منها (Σ I_in = Σ I_out).</li>
                      <li><strong>قانون كيرشوف الثاني (حفظ الطاقة):</strong> المجموع الجبري للقوى الدافعة في أي مسار مغلق يساوي المجموع الجبري لفروق الجهد (Σ V_B = Σ IR).</li>
                      <li>انتبه جيداً لإشارات فروق الجهد والاتجاه المفترض للمسار والمقاومة الداخلية للمنابع (r).</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div>
                    {/* صندوق إضافة تعليق/سؤال جديد */}
                    <form onSubmit={handleAddQuestion} className="card border p-3 rounded-3 bg-light mb-4">
                      <label className="form-label fw-bold small text-dark mb-2">
                        لديك سؤال أو نقطة غير واضحة في الحصة؟
                      </label>
                      
                      <textarea
                        rows="3"
                        className="form-control rounded-3 mb-2"
                        placeholder="اكتب استفسارك هنا بالتفصيل لمستر الفيزياء أو فريق المساعدين..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                      ></textarea>

                      <div className="d-flex justify-content-between align-items-center">
                        <label className="btn btn-outline-secondary btn-sm rounded-2 d-flex align-items-center gap-1 mb-0" style={{ cursor: 'pointer' }}>
                          <span>📷 إرفاق صورة مسألة</span>
                          <input type="file" accept="image/*" className="d-none" />
                        </label>

                        <button 
                          type="submit" 
                          disabled={!newQuestion.trim()} 
                          className="btn btn-primary btn-sm px-4 fw-bold rounded-2 shadow-sm"
                        >
                          نشر السؤال
                        </button>
                      </div>
                    </form>

                    {/* قائمة الأسئلة السابقة */}
                    <div className="d-flex flex-column gap-3">
                      {questions.map((q) => (
                        <div key={q.id} className="p-3 bg-light rounded-3 border">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-bold small text-dark">{q.student}</span>
                            <span className="text-muted" style={{ fontSize: '11px' }}>{q.time}</span>
                          </div>
                          <p className="small text-secondary mb-2">{q.text}</p>
                          {q.reply && (
                            <div className="p-2 bg-white rounded-2 border-start border-3 border-primary small text-primary-emphasis">
                              <strong>رد المعلم:</strong> {q.reply}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-light">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-2 text-danger">📄</span>
                      <div>
                        <div className="fw-bold small">شيت واجب الدرس مع الحلول النموذجية.pdf</div>
                        <small className="text-muted">الحجم: 2.4 MB</small>
                      </div>
                    </div>
                    <button onClick={() => alert('جاري تحميل شيت الواجب...')} className="btn btn-outline-primary btn-sm fw-bold rounded-2">
                      تحميل الملف
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* قائمة دروس الفصل الجانبية */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark">دروس الفصل الأول</h6>
              <div className="list-group list-group-flush gap-2">
                {lessonsList.map((l) => {
                  const isActive = l.id === activeLessonId;
                  return (
                    <div 
                      key={l.id} 
                      onClick={() => setActiveLessonId(l.id)}
                      className={`list-group-item list-group-item-action rounded-3 border-0 d-flex justify-content-between align-items-center p-3 transition-all ${
                        isActive ? 'bg-primary text-white shadow-sm' : 'bg-light'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div>
                        <div className={`small fw-bold ${isActive ? 'text-white' : 'text-dark'}`}>{l.title}</div>
                        <small className={isActive ? 'text-white-50' : 'text-muted'}>{l.duration}</small>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2">
                        {l.completed && (
                          <span className={`badge ${isActive ? 'bg-light text-success' : 'bg-success-subtle text-success'}`}>
                            ✓ مكتمل
                          </span>
                        )}
                        {isActive && !l.completed && (
                          <span className="badge bg-white text-primary">مشاهدة</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}