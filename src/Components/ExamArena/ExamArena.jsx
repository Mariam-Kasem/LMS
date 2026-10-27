import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://physics-lms-backend.vercel.app';

// قائمة الامتحانات كأمثلة ونموذج للبيانات
const EXAMS_DATABASE = [
  {
    id: 'exam-1',
    title: 'امتحان الفيزياء الدوري • قوانين الدوائر الكهربية',
    topic: 'الفصل الأول: التيار الكهربي وقانون أوم',
    durationMinutes: 10,
    isAutoTimed: false,
    questions: [
      {
        id: 1,
        question: 'في الدائرة الموضحة، إذا كانت المقاومة الكلية 5 أوم وفرق الجهد الكلي 20 فولت، ما هي شدة التيار الكلي المار؟',
        image: '',
        options: ['2 أمبير', '4 أمبير', '10 أمبير', '100 أمبير'],
        correct: 1,
        hint: 'I = V / R = 20 / 5 = 4A'
      },
      {
        id: 2,
        question: 'قانون كيرشوف الأول يعتبر تطبيقاً مباشراً لمبدأ بقاء:',
        image: '',
        options: ['الطاقة', 'الشحنة الكهربية', 'كمية الحركة', 'الكتلة'],
        correct: 1,
        hint: 'مجموع الشحنات الداخلة في نقطة تفرع يساوي مجموع الشحنات الخارجة منها.'
      },
      {
        id: 3,
        question: 'سلك مستقيم مقاومته R، تم سحبه بانتظام بحيث زاد طوله إلى الضعف، تصبح مقاومته الجديدة:',
        image: '',
        options: ['R/2', '2R', '4R', 'R'],
        correct: 2,
        hint: 'عند سحب السلك، زيادة الطول للضعف تعني نقص مساحة المقطع للنصف، فتتضاعف المقاومة أربع مرات (4R).'
      }
    ]
  },
  {
    id: 'exam-2',
    title: 'كويز التأثير المغناطيسي وأجهزة القياس',
    topic: 'الفصل الثاني: الفيض وقوة لورنتز',
    durationMinutes: 15,
    isAutoTimed: true,
    availableFrom: '2026-10-27T18:00:00',
    availableTo: '2026-10-27T23:59:59',
    questions: []
  },
  {
    id: 'exam-3',
    title: 'الامتحان الشامل على الباب الأول والثاني',
    topic: 'مراجعة شاملة نصف المنهج',
    durationMinutes: 30,
    isAutoTimed: true,
    availableFrom: '2026-11-01T10:00:00',
    availableTo: '2026-11-01T18:00:00',
    questions: []
  }
];

export default function ExamArena({ onExit }) {
  const navigate = useNavigate();

  const [activeExam, setActiveExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examScores, setExamScores] = useState({});

  // التحقق من حالة وموعد الامتحان
  const checkExamStatus = (exam) => {
    if (!exam.isAutoTimed) {
      return { canEnter: true, status: 'open', message: 'متاح للحل الآن' };
    }

    const now = new Date();
    const from = new Date(exam.availableFrom);
    const to = new Date(exam.availableTo);

    if (now < from) {
      return {
        canEnter: false,
        status: 'upcoming',
        message: `⏳ يبدأ في: ${from.toLocaleDateString('ar-EG')} الساعة ${from.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`
      };
    }

    if (now > to) {
      return {
        canEnter: false,
        status: 'expired',
        message: '⛔ انتهى وقت هذا الامتحان ولم يعد متاحاً للتسليم.'
      };
    }

    return { canEnter: true, status: 'active', message: '🟢 متاح للبدء الآن' };
  };

  // جلب الدرجات السابقة من الباك إند
  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.exams)) {
            const mappedScores = {};
            data.exams.forEach((item) => {
              mappedScores[item.examId] = {
                score: item.score,
                total: item.total,
                title: item.title,
                date: item.date,
              };
            });
            setExamScores(mappedScores);
          }
        }
      } catch (error) {
        console.error('فشل جلب النتائج من السيرفر:', error);
      }
    };

    fetchUserScores();
  }, []);

  // بدء الامتحان
  const handleStartExam = (exam) => {
    const status = checkExamStatus(exam);
    if (!status.canEnter) return;

    setActiveExam(exam);
    setTimeLeft(exam.durationMinutes * 60);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  // تشغيل المؤقت
  useEffect(() => {
    if (!activeExam || isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam, timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelect = (qId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    if (!activeExam) return 0;
    let score = 0;
    activeExam.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  // إرسال الدرجة للباك إند
  const handleSubmit = async () => {
    const finalScore = calculateScore();
    const totalQuestions = activeExam.questions.length;

    const newScores = {
      ...examScores,
      [activeExam.id]: {
        score: finalScore,
        total: totalQuestions,
        title: activeExam.title,
      },
    };
    setExamScores(newScores);
    setIsSubmitted(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`${API_BASE_URL}/api/auth/submit-exam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examId: activeExam.id,
          examTitle: activeExam.title,
          score: finalScore,
          total: totalQuestions,
        }),
      });
    } catch (error) {
      console.error('فشل إرسال النتيجة للباك إند:', error);
    }
  };

  const handleSafeExit = () => {
    if (activeExam && !isSubmitted) {
      if (window.confirm('هل أنت متأكد من الخروج؟ سيتم إلغاء تقدمك في هذا الامتحان!')) {
        setActiveExam(null);
      }
    } else if (activeExam && isSubmitted) {
      setActiveExam(null);
    } else {
      if (onExit) onExit();
      navigate('/home');
    }
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  // ================= 1. شاشة قائمة الامتحانات =================
  if (!activeExam) {
    return (
      <div dir="rtl" className="bg-light min-vh-100 py-4">
        <div className="container" style={{ maxWidth: '850px' }}>
          
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h4 className="fw-bold mb-1 text-dark">📋 ساحة الاختبارات والتقييم الدوري</h4>
                <p className="text-secondary small mb-0">اختر الاختبار المتاح لك للبدء فوراً، أو انتظر المواعيد المحددة للامتحانات المجدولة.</p>
              </div>
              <button onClick={() => navigate('/home')} className="btn btn-outline-secondary btn-sm px-3 rounded-3 fw-bold">
                ← العودة للرئيسية
              </button>
            </div>
          </div>

          <div className="row g-3">
            {EXAMS_DATABASE.map((exam) => {
              const completedData = examScores[exam.id];
              const timeStatus = checkExamStatus(exam);
              const isLocked = !timeStatus.canEnter && !completedData;

              return (
                <div key={exam.id} className="col-12">
                  <div className={`card border-0 shadow-sm rounded-4 p-4 bg-white ${isLocked ? 'opacity-75' : ''}`}>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className={`badge rounded-pill px-3 py-2 ${
                            completedData 
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : isLocked 
                              ? 'bg-secondary-subtle text-secondary border border-secondary-subtle' 
                              : 'bg-primary-subtle text-primary border border-primary-subtle'
                          }`}>
                            {completedData ? '✓ تم الانتهاء' : isLocked ? '🔒 مغلق' : '⚡ متاح للبدء'}
                          </span>
                          <small className="text-muted">{exam.durationMinutes} دقيقة • {exam.questions.length || '—'} أسئلة</small>
                        </div>

                        <h5 className="fw-bold text-dark mb-1">{exam.title}</h5>
                        <p className="text-secondary small mb-1">{exam.topic}</p>

                        {!completedData && (
                          <div className={`small fw-semibold mt-2 ${timeStatus.canEnter ? 'text-success' : 'text-danger'}`}>
                            {timeStatus.message}
                          </div>
                        )}

                        {completedData && (
                          <div className="small text-success fw-bold mt-2">
                            أعلى نتيجة لك: {completedData.score} من {completedData.total} ({Math.round((completedData.score / completedData.total) * 100)}%)
                          </div>
                        )}
                      </div>

                      <div>
                        {completedData ? (
                          <button
                            onClick={() => handleStartExam(exam)}
                            className="btn btn-outline-primary px-4 py-2 rounded-3 fw-bold"
                          >
                            إعادة المحاولة
                          </button>
                        ) : (
                          <button
                            disabled={!timeStatus.canEnter}
                            onClick={() => handleStartExam(exam)}
                            className={`btn px-4 py-2 rounded-3 fw-bold shadow-sm ${
                              timeStatus.canEnter ? 'btn-primary' : 'btn-light border text-muted'
                            }`}
                          >
                            {timeStatus.canEnter ? 'بدء الامتحان الآن' : 'غير متاح حالياً'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  // ================= 2. شاشة أداء الامتحان النشط =================
  return (
    <div dir="rtl" className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* رأس الامتحان والعداد */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white sticky-top">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-0">{activeExam.title}</h5>
              <small className="text-muted">
                تمت الإجابة عن: {answeredCount} من {activeExam.questions.length}
              </small>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              {!isSubmitted && (
                <div className={`badge fs-6 px-3 py-2 ${timeLeft < 120 ? 'bg-danger' : 'bg-primary'}`}>
                  ⏱️ {formatTime(timeLeft)}
                </div>
              )}
              <button onClick={handleSafeExit} className="btn btn-outline-secondary btn-sm rounded-3">
                خروج
              </button>
            </div>
          </div>

          {!isSubmitted && (
            <div className="progress mt-2" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-success" 
                style={{ width: `${(answeredCount / activeExam.questions.length) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* كارت النتيجة بعد التسليم */}
        {isSubmitted && (
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center bg-white border-top border-5 border-success">
            <h4 className="fw-bold text-success mb-2">🎉 تم تصحيح الامتحان إلكترونياً</h4>
            <div className="display-5 fw-bold text-dark my-2">
              {calculateScore()} / {activeExam.questions.length}
            </div>
            <p className="text-muted mb-0">النسبة المئوية: {Math.round((calculateScore() / activeExam.questions.length) * 100)}%</p>
          </div>
        )}

        {/* الأسئلة ودعم صور الفيزياء */}
        <div className="d-flex flex-column gap-3 mb-4">
          {activeExam.questions.map((q, idx) => (
            <div key={q.id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">س{idx + 1}: {q.question}</h6>

              {/* إظهار صورة المسألة أو الدائرة الكهربية إن وُجدت */}
              {q.image && (
                <div className="text-center my-3 p-2 bg-light rounded-3 border">
                  <img 
                    src={q.image} 
                    alt={`رسمة توضيحية للسؤال ${idx + 1}`} 
                    className="img-fluid rounded border shadow-sm"
                    style={{ maxHeight: '250px', objectFit: 'contain' }}
                  />
                </div>
              )}
              
              <div className="d-flex flex-column gap-2">
                {q.options.map((opt, oIdx) => {
                  let btnClass = 'btn-outline-secondary';
                  const isSelected = selectedAnswers[q.id] === oIdx;

                  if (isSubmitted) {
                    if (oIdx === q.correct) btnClass = 'btn-success text-white fw-bold';
                    else if (isSelected) btnClass = 'btn-danger text-white';
                  } else if (isSelected) {
                    btnClass = 'btn-primary text-white fw-bold';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(q.id, oIdx)}
                      className={`btn p-3 rounded-3 text-end ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && q.hint && (
                <div className="mt-3 p-3 bg-light rounded-3 small text-secondary">
                  <strong>💡 خطوات الحل:</strong> {q.hint}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* أزرار الإجراء */}
        {!isSubmitted ? (
          <button 
            onClick={() => {
              if (answeredCount < activeExam.questions.length) {
                if (window.confirm(`لم تجب عن جميع الأسئلة بعد (${answeredCount}/${activeExam.questions.length}). هل أنت متأكد من تسليم الإجابات؟`)) {
                  handleSubmit();
                }
              } else {
                handleSubmit();
              }
            }} 
            className="btn btn-primary w-100 py-3 fw-bold rounded-4 shadow-sm"
          >
            تسليم الإجابات وإنهاء الامتحان
          </button>
        ) : (
          <button onClick={() => setActiveExam(null)} className="btn btn-secondary w-100 py-3 fw-bold rounded-4">
            العودة لساحة الامتحانات
          </button>
        )}

      </div>
    </div>
  );
}