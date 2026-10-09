import React, { useState } from 'react';

export default function LessonView({ onBack, onCompleteLesson }) {
  const [activeTab, setActiveTab] = useState('notes'); // notes | qa | attachments
  const [questions, setQuestions] = useState([
    { id: 1, student: 'أحمد', text: 'هو ليه في قانون كيرشوف التاني بنعوض عن القوة الدافعة الكهربية بالسالب لو عكس اتجاه المسار؟', time: 'منذ ساعتين', reply: 'لأننا بنمشي مع اتجاه هبوط الجهد يا بطل، راجع الدقيقة 24:15 في الفيديو.' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions([
      ...questions,
      { id: Date.now(), student: 'أنت', text: newQuestion, time: 'الآن', reply: null }
    ]);
    setNewQuestion('');
  };

  return (
    <div dir="rtl" className="bg-light min-vh-100 py-4">
      <div className="container">
        
        {/* شريط الرجوع والعنوان */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <button onClick={onBack} className="btn btn-outline-secondary btn-sm px-3 fw-bold">
            <i className="bi bi-arrow-right me-1"></i> العودة للرئيسية
          </button>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
            الفصل الأول: كهربية • الدرس الثالث
          </span>
        </div>

        <div className="row g-4">
          {/* مشغل الفيديو والتبويبات */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              
              {/* مشغل الفيديو مع العلامة المائية */}
              <div className="position-relative bg-black" style={{ aspectRatio: '16/9' }}>
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  controls
                  controlsList="nodownload"
                  className="w-100 h-100"
                />
                <div 
                  className="position-absolute text-white opacity-25 fw-bold user-select-none" 
                  style={{ top: '35%', left: '30%', pointerEvents: 'none', transform: 'rotate(-12deg)', fontSize: '14px' }}
                >
                  أحمد محمد علي • PHY-3042 • 01012345678
                </div>
              </div>

              <div className="p-3 bg-white d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark mb-1">المحاضرة 3: تطبيقات قانوني كيرشوف والمسارات المغلقة</h5>
                  <small className="text-muted">المدة: 1 ساعة و 40 دقيقة</small>
                </div>
                <button onClick={onCompleteLesson} className="btn btn-success fw-bold btn-sm px-3">
                  <i className="bi bi-check2-circle me-1"></i> تحديد كمكتمل
                </button>
              </div>
            </div>

            {/* التبويبات أسفل الفيديو */}
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <ul className="nav nav-pills mb-3 border-bottom pb-2">
                <li className="nav-item">
                  <button className={`nav-link fw-bold ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                    ملخص الدرس
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link fw-bold ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>
                    أسئلة واستفسارات الطلاب ({questions.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link fw-bold ${activeTab === 'attachments' ? 'active' : ''}`} onClick={() => setActiveTab('attachments')}>
                    المرفقات والملازم
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                {activeTab === 'notes' && (
                  <div>
                    <h6 className="fw-bold text-primary mb-2">أهم نقاط الحصة:</h6>
                    <ul className="text-secondary small lh-lg mb-0">
                      <li>قانون كيرشوف الأول (قانون حفظ الشحنة): مجموع التيارات الداخلة = مجموع التيارات الخارجة عند أي نقطة تفرع.</li>
                      <li>قانون كيرشوف الثاني (قانون حفظ الطاقة): المجموع الجبري للقوى الدافعة الكهربية في أي مسار مغلق = المجموع الجبري لفروق الجهد.</li>
                      <li>انتبه لإشارات فروق الجهد والمقاومة الداخلية للبطاريات.</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div>
                    <form onSubmit={handleAddQuestion} className="mb-4">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="اكتب استفسارك لمستر الفيزياء أو المساعدين..."
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                        />
                        <button className="btn btn-primary fw-bold" type="submit">إرسال السؤال</button>
                      </div>
                    </form>

                    <div className="d-flex flex-column gap-3">
                      {questions.map((q) => (
                        <div key={q.id} className="p-3 bg-light rounded-3">
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
                      <i className="bi bi-file-earmark-pdf-fill fs-2 text-danger"></i>
                      <div>
                        <div className="fw-bold small">شيت واجب كيرشوف مع الحلول النموذجية.pdf</div>
                        <small className="text-muted">الحجم: 2.4 MB</small>
                      </div>
                    </div>
                    <button className="btn btn-outline-primary btn-sm fw-bold">تحميل الملف</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* قائمة دروس الفصل الجانبية */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <h6 className="fw-bold mb-3 border-bottom pb-2">دروس الفصل الأول</h6>
              <div className="list-group list-group-flush gap-2">
                {[
                  { id: 1, title: 'الدرس 1: شدة التيار وفرق الجهد', completed: true },
                  { id: 2, title: 'الدرس 2: توصيل المقاومات', completed: true },
                  { id: 3, title: 'الدرس 3: قانون كيرشوف الأول والثاني', active: true },
                  { id: 4, title: 'الدرس 4: حل مسائل معقدة على كيرشوف', completed: false },
                ].map((l) => (
                  <div 
                    key={l.id} 
                    className={`list-group-item list-group-item-action rounded-3 border-0 d-flex justify-content-between align-items-center p-3 ${
                      l.active ? 'bg-primary text-white' : 'bg-light'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="small fw-bold">{l.title}</div>
                    {l.completed && <i className="bi bi-check-circle-fill text-success fs-5"></i>}
                    {l.active && <span className="badge bg-white text-primary">جاري المشاهدة</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}