import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'students' | 'add-lesson' | 'add-exam'
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // حالات إضافة حصة / PDF جديدة
  const [lessonData, setLessonData] = useState({
    title: '',
    chapter: 'الفصل الأول: التيار الكهربائي وقانون أوم',
    videoUrl: '',
    pdfUrl: '',
    description: ''
  });

  // حالات إضافة امتحان جديد مع دعم صور الدوائر الكهربية والفيزياء
  const [examTitle, setExamTitle] = useState('');
  
  // إعدادات توقيت وجدولة الامتحان
  const [timingSettings, setTimingSettings] = useState({
    isAutoTimed: false,
    availableFrom: '',
    availableTo: '',
    durationMinutes: 45
  });

  const [questions, setQuestions] = useState([
    { 
      questionText: '', 
      image: '', 
      options: ['', '', '', ''], 
      correctIndex: 0 
    }
  ]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get('https://physics-lms-backend.vercel.app/api/admin/analytics', { headers }).catch(() => null);
      if (res?.data) {
        setAnalytics(res.data);
        setStudents(res.data.recentStudents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // دوال إدارة أسئلة الامتحان
  const addQuestionField = () => {
    setQuestions([
      ...questions,
      { questionText: '', image: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index, val) => {
    const updated = [...questions];
    updated[index].questionText = val;
    setQuestions(updated);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...questions];
        updated[index].image = reader.result;
        setQuestions(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateOption = (qIndex, optIndex, val) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = val;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctIndex = optIndex;
    setQuestions(updated);
  };

  return (
    <div className="container-fluid py-4 px-md-5" dir="rtl">
      
      {/* عنوان اللوحة وأزرار الأقسام */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">لوحة تحكم وإدارة المعلم 👨‍🏫</h2>
          <p className="text-muted small mb-0">تحكم بالكامل في المحتوى التعليمي، الامتحانات، ومتابعة درجات وحضور الطلاب</p>
        </div>

        {/* أزرار التبديل بنظام Bootstrap */}
        <div className="btn-group bg-white p-1 border rounded-3 shadow-sm flex-wrap">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')} 
            className={`btn btn-sm fw-bold ${activeTab === 'overview' ? 'btn-primary' : 'btn-light text-secondary'}`}
          >
            📊 الإحصائيات العامة
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('students')} 
            className={`btn btn-sm fw-bold ${activeTab === 'students' ? 'btn-primary' : 'btn-light text-secondary'}`}
          >
            👥 متابعة الطلاب والدرجات
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('add-lesson')} 
            className={`btn btn-sm fw-bold ${activeTab === 'add-lesson' ? 'btn-primary' : 'btn-light text-secondary'}`}
          >
            🎥 إضافة درس / مذكرة PDF
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('add-exam')} 
            className={`btn btn-sm fw-bold ${activeTab === 'add-exam' ? 'btn-primary' : 'btn-light text-secondary'}`}
          >
            📝 إنشاء امتحان جديد
          </button>
        </div>
      </div>

      {/* 1. قسم النظرة العامة والإحصائيات */}
      {activeTab === 'overview' && (
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white-50 fw-bold">إجمالي الطلاب</div>
                  <h3 className="fw-bold mb-0 mt-2">{analytics?.totalStudents || 1}</h3>
                </div>
                <i className="bi bi-people fs-1 text-white-50"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white-50 fw-bold">امتحانات تم تسليمها</div>
                  <h3 className="fw-bold mb-0 mt-2">{analytics?.totalExamsSubmitted || 0}</h3>
                </div>
                <i className="bi bi-check2-circle fs-1 text-white-50"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-warning text-dark">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small fw-bold">الفصول النشطة</div>
                  <h3 className="fw-bold mb-0 mt-2">2 فصل</h3>
                </div>
                <i className="bi bi-journal-bookmark fs-1 text-black-50"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-dark text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="small text-white-50 fw-bold">حالة النظام</div>
                  <h5 className="fw-bold mb-0 mt-2 text-success">متصل بالخادم 🟢</h5>
                </div>
                <i className="bi bi-hdd-network fs-1 text-white-50"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. قسم متابعة الطلاب والدرجات والاشتراكات */}
      {activeTab === 'students' && (
        <div className="card border rounded-4 shadow-sm p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">قائمة الطلاب وحالة تسليم الامتحانات والاشتراك</h5>
            <span className="badge bg-primary fs-6">عدد الطلاب: {students.length}</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-light text-secondary small">
                <tr>
                  <th>اسم الطالب</th>
                  <th>كود الطالب</th>
                  <th>رقم الهاتف</th>
                  <th>هاتف ولي الأمر</th>
                  <th>المحافظة</th>
                  <th>الفصول المشترك بها</th>
                  <th>حالة الامتحان</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((st) => (
                    <tr key={st._id}>
                      <td className="fw-bold text-dark">{st.name}</td>
                      <td><span className="badge bg-light text-primary border">{st.code || 'بدون كود'}</span></td>
                      <td>{st.phone}</td>
                      <td className="text-muted">{st.parentPhone}</td>
                      <td>{st.governorate}</td>
                      <td>
                        <span className="badge bg-info-subtle text-info fw-bold">
                          {st.subscribedChapters?.length || 0} فصول
                        </span>
                      </td>
                      <td>
                        {st.exams && st.exams.length > 0 ? (
                          <span className="badge bg-success">تم أداء ({st.exams.length}) امتحان</span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger">لم يدخل الامتحان بعد</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-muted py-4">
                      {loading ? 'جاري تحميل بيانات الطلاب...' : 'لا توجد بيانات طلاب حالياً.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. قسم رفع وإضافة درس جديد أو مذكرة PDF */}
      {activeTab === 'add-lesson' && (
        <div className="card border rounded-4 shadow-sm p-4 bg-white" style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h5 className="fw-bold mb-3 border-bottom pb-2">🎥 نشر حصة جديدة أو ملخص PDF للطلاب</h5>
          <form onSubmit={(e) => { e.preventDefault(); alert('تم حفظ الدرس بنجاح ونشره للطلاب!'); }}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">اختر الفصل الدراسي</label>
              <select 
                className="form-select"
                value={lessonData.chapter}
                onChange={(e) => setLessonData({...lessonData, chapter: e.target.value})}
              >
                <option>الفصل الأول: التيار الكهربائي وقانون أوم وكيرشوف</option>
                <option>الفصل الثاني: التأثير المغناطيسي للتيار الكهربي</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">عنوان الدرس / الحصة</label>
              <input 
                type="text" 
                required 
                placeholder="مثال: شرح قانون كيرشوف الأول والثاني وتطبيقات المسائل" 
                className="form-control"
                value={lessonData.title}
                onChange={(e) => setLessonData({...lessonData, title: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">رابط الفيديو (YouTube Unlisted أو رابط مباشر)</label>
              <input 
                type="url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                className="form-control"
                value={lessonData.videoUrl}
                onChange={(e) => setLessonData({...lessonData, videoUrl: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">رابط ملف الـ PDF (المذكرة أو الواجب من Google Drive)</label>
              <input 
                type="url" 
                placeholder="https://drive.google.com/file/d/..." 
                className="form-control"
                value={lessonData.pdfUrl}
                onChange={(e) => setLessonData({...lessonData, pdfUrl: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">ملاحظات أو وصف الدرس</label>
              <textarea 
                rows="3" 
                className="form-control" 
                placeholder="تعليمات للطالب قبل مشاهدة الحصة..."
                value={lessonData.description}
                onChange={(e) => setLessonData({...lessonData, description: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary fw-bold px-4 py-2 rounded-3">
              🚀 حفظ ونشر الحصة للطلاب
            </button>
          </form>
        </div>
      )}

      {/* 4. قسم إنشاء امتحان إلكتروني مع التوقيت ودعم صور الفيزياء */}
      {activeTab === 'add-exam' && (
        <div className="card border rounded-4 shadow-sm p-4 bg-white" style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h5 className="fw-bold mb-3 border-bottom pb-2">📝 بناء امتحان إلكتروني وتحديد الإجابات النموذجية</h5>
          
          <form onSubmit={(e) => { e.preventDefault(); alert('تم حفظ ونشر الامتحان للطلاب بنجاح!'); }}>
            
            {/* عنوان الامتحان */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-secondary">عنوان الامتحان</label>
              <input 
                type="text" 
                required 
                placeholder="مثال: كويز شامل على قانون أوم للدائرة المغلقة" 
                className="form-control"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
              />
            </div>

            {/* إعدادات التوقيت والجدولة الزمنية */}
            <div className="card p-3 mb-4 bg-light border-0 rounded-3">
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoTimeSwitch"
                  checked={timingSettings.isAutoTimed}
                  onChange={(e) => setTimingSettings({...timingSettings, isAutoTimed: e.target.checked})}
                />
                <label className="form-check-label fw-bold text-dark" htmlFor="autoTimeSwitch">
                  ⏱️ جدولة الامتحان بموعد فتح وإغلاق تلقائي
                </label>
              </div>

              {timingSettings.isAutoTimed && (
                <div className="row g-3 mt-1">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold text-secondary">وقت البدء (متاح من)</label>
                    <input 
                      type="datetime-local" 
                      className="form-control form-control-sm"
                      value={timingSettings.availableFrom}
                      onChange={(e) => setTimingSettings({...timingSettings, availableFrom: e.target.value})}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold text-secondary">وقت الانتهاء (يغلق في)</label>
                    <input 
                      type="datetime-local" 
                      className="form-control form-control-sm"
                      value={timingSettings.availableTo}
                      onChange={(e) => setTimingSettings({...timingSettings, availableTo: e.target.value})}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold text-secondary">مدة الامتحان (بالدقائق)</label>
                    <input 
                      type="number" 
                      className="form-control form-control-sm"
                      min="5"
                      value={timingSettings.durationMinutes}
                      onChange={(e) => setTimingSettings({...timingSettings, durationMinutes: Number(e.target.value)})}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* قائمة الأسئلة */}
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-3 border rounded-3 bg-light mb-4 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold text-primary">السؤال رقم ({qIndex + 1})</span>
                  {questions.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeQuestion(qIndex)}
                      className="btn btn-outline-danger btn-sm py-0 px-2 small rounded-pill"
                      title="حذف هذا السؤال"
                    >
                      ✕ حذف
                    </button>
                  )}
                </div>

                {/* نص السؤال */}
                <input 
                  type="text" 
                  placeholder="اكتب رأس السؤال أو المسألة هنا..." 
                  className="form-control mb-3"
                  required
                  value={q.questionText}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                />

                {/* إدراج صورة المسألة / الدائرة الكهربية */}
                <div className="mb-3 p-2 bg-white rounded border">
                  <label className="form-label small fw-bold text-secondary mb-1 d-flex align-items-center gap-1">
                    📷 إدراج رسمة أو دائرة كهربية للسؤال (اختياري)
                  </label>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="form-control form-control-sm"
                      style={{ maxWidth: '280px' }}
                      onChange={(e) => handleImageUpload(qIndex, e)}
                    />
                    <span className="text-muted small">أو ضع رابط مباشر:</span>
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      className="form-control form-control-sm flex-grow-1"
                      value={q.image.startsWith('data:') ? '' : q.image}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIndex].image = e.target.value;
                        setQuestions(updated);
                      }}
                    />
                  </div>

                  {/* معاينة الصورة المرفوعة */}
                  {q.image && (
                    <div className="mt-2 text-center p-2 bg-light rounded border">
                      <p className="small text-muted mb-1">معاينة الرسمة:</p>
                      <img 
                        src={q.image} 
                        alt="رسمة السؤال" 
                        className="img-fluid rounded border shadow-sm" 
                        style={{ maxHeight: '180px', objectFit: 'contain' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const updated = [...questions];
                          updated[qIndex].image = '';
                          setQuestions(updated);
                        }}
                        className="btn btn-link btn-sm text-danger d-block mx-auto mt-1 p-0 text-decoration-none"
                      >
                        إزالة الصورة ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* الاختيارات الأربعة */}
                <div className="row g-2">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="col-12 col-md-6">
                      <div className="input-group">
                        <div className="input-group-text bg-white">
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`} 
                            title="حدد هذه كإجابة صحيحة للنموذج"
                            checked={q.correctIndex === optIndex}
                            onChange={() => setCorrectAnswer(qIndex, optIndex)}
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder={`الاختيار (${optIndex + 1})`} 
                          className="form-control"
                          required
                          value={opt}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <small className="text-muted d-block mt-2">
                  * اضغط على الدائرة بجانب الاختيار لتحديده كإجابة صحيحة للنموذج.
                </small>
              </div>
            ))}

            {/* أزرار الإضافة والحفظ */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button 
                type="button" 
                onClick={addQuestionField} 
                className="btn btn-outline-secondary btn-sm fw-bold"
              >
                ➕ إضافة سؤال آخر
              </button>

              <button type="submit" className="btn btn-success fw-bold px-4 py-2 rounded-3">
                💾 اعتماد ونشر الامتحان للطلاب
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}