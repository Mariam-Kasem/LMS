import React, { useState, useEffect } from 'react';

export default function ExamArena({ onExit }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 دقائق
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      question: 'في الدائرة الموضحة، إذا كانت المقاومة الكلية 5 أوم وفرق الجهد الكلي 20 فولت، ما هي شدة التيار الكلي المار؟',
      options: ['2 أمبير', '4 أمبير', '10 أمبير', '100 أمبير'],
      correct: 1,
      hint: 'I = V / R = 20 / 5 = 4A'
    },
    {
      id: 2,
      question: 'قانون كيرشوف الأول يعتبر تطبيقاً مباشراً لمبدأ بقاء:',
      options: ['الطاقة', 'الشحنة الكهربية', 'كمية الحركة', 'الكتلة'],
      correct: 1,
      hint: 'مجموع الشحنات الداخلة في نقطة تفرع يساوي مجموع الشحنات الخارجة منها.'
    },
    {
      id: 3,
      question: 'سلك مستقيم مقاومته R، تم سحبه بانتظام بحيث زاد طوله إلى الضعف، تصبح مقاومته الجديدة:',
      options: ['R/2', '2R', '4R', 'R'],
      correct: 2,
      hint: 'عند سحب السلك، زيادة الطول للضعف تعني نقص مساحة المقطع للنصف، فتتضاعف المقاومة أربع مرات (4R).'
    }
  ];

  // تشغيل المؤقت
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelect = (qId, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  return (
    <div dir="rtl" className="bg-light min-vh-100 py-4">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* رأس الامتحان والعداد */}
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white sticky-top">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-0">امتحان الفيزياء الدوري • قوانين الدوائر</h5>
              <small className="text-muted">عدد الأسئلة: {questions.length}</small>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              {!isSubmitted && (
                <div className={`badge fs-6 px-3 py-2 ${timeLeft < 120 ? 'bg-danger' : 'bg-primary'}`}>
                  <i className="bi bi-clock me-1"></i> {formatTime(timeLeft)}
                </div>
              )}
              <button onClick={onExit} className="btn btn-outline-secondary btn-sm">خروج</button>
            </div>
          </div>
        </div>

        {/* كارت النتيجة إذا تم التسليم */}
        {isSubmitted && (
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 text-center bg-white border-top border-5 border-success">
            <h4 className="fw-bold text-success mb-2">🎉 تم تصحيح الامتحان إلكترونياً</h4>
            <div className="display-5 fw-bold text-dark my-2">
              {calculateScore()} / {questions.length}
            </div>
            <p className="text-muted">النسبة المئوية: {Math.round((calculateScore() / questions.length) * 100)}%</p>
          </div>
        )}

        {/* عرض الأسئلة */}
        <div className="d-flex flex-column gap-3 mb-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-dark mb-3">س{idx + 1}: {q.question}</h6>
              
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
                      className={`btn text-start p-3 rounded-3 text-end ${btnClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className="mt-3 p-3 bg-light rounded-3 small text-secondary">
                  <strong>💡 خطوات الحل:</strong> {q.hint}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* زر تسليم الامتحان */}
        {!isSubmitted ? (
          <button 
            onClick={() => setIsSubmitted(true)} 
            className="btn btn-primary w-100 py-3 fw-bold rounded-4 shadow-sm"
          >
            تسليم الإجابات وإنهاء الامتحان
          </button>
        ) : (
          <button onClick={onExit} className="btn btn-secondary w-100 py-3 fw-bold rounded-4">
            العودة للقائمة الرئيسية
          </button>
        )}

      </div>
    </div>
  );
}