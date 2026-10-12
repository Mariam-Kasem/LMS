import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FawryPaymentModal from '../FawryPaymentModal/FawryPaymentModal';

export default function Home({ user }) {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [selectedChapterForSub, setSelectedChapterForSub] = useState(null);
  const [rechargeCode, setRechargeCode] = useState('');
  const [subMessage, setSubMessage] = useState({ text: '', type: '' });
  const [fawryInfo, setFawryInfo] = useState(null);
  const [loadingFawry, setLoadingFawry] = useState(false);

  // قراءة بيانات المستخدم الحالي
  const currentUser = user || JSON.parse(localStorage.getItem('user')) || {};

  const student = {
    name: currentUser?.name || 'مريم قاسم',
    code: currentUser?.code || 'PHY-0000',
    progress: currentUser?.progress || 0
  };

  const firstName = student.name.trim().split(' ')[0];
  const progressPercentage = student.progress;

  // فصول منهج فيزياء 3 ثانوي وحالة الاشتراك
  const [chapters, setChapters] = useState([
    {
      id: 'chap-1',
      title: 'الفصل الأول: التيار الكهربائي وقانون أوم وكيرشوف',
      desc: 'دراسة شدة التيار، فرق الجهد، المقاومة النوعية، توصيل المقاومات، وقانونا كيرشوف.',
      price: 150,
      lecturesCount: 8,
      hoursCount: 16,
      isUnlocked: true // مفتوح افتراضياً للتجربة
    },
    {
      id: 'chap-2',
      title: 'الفصل الثاني: التأثير المغناطيسي للتيار الكهربي وأجهزة القياس',
      desc: 'المجال المغناطيسي لسلك وملف دائري ولولبي، القوة وعزم الازدواج، والجلفانومتر والأميتر والفولتميتر.',
      price: 180,
      lecturesCount: 10,
      hoursCount: 20,
      isUnlocked: false
    },
    {
      id: 'chap-3',
      title: 'الفصل الثالث: الحث الكهرومغناطيسي',
      desc: 'قانون فاراداي، الحث الذاتي والمتبادل، المولد الكهربي (الدينامو)، والمحولات والمحركات.',
      price: 180,
      lecturesCount: 12,
      hoursCount: 22,
      isUnlocked: false
    },
    {
      id: 'chap-4',
      title: 'الفصل الرابع: دوائر التيار المتردد',
      desc: 'المعاوقة والمفاعلة الحثية والسعوية، دوائر الرنين والدائرة المهتزة.',
      price: 140,
      lecturesCount: 6,
      hoursCount: 12,
      isUnlocked: false
    },
    {
      id: 'chap-5',
      title: 'الفصل الخامس: ازدواجية الموجة والجسيم (الفيزياء الحديثة)',
      desc: 'إشعاع الجسم الأسود، الظاهرة الكهروضوئية، وظاهرة كومتون، ومجهر القوة الذرية.',
      price: 130,
      lecturesCount: 6,
      hoursCount: 10,
      isUnlocked: false
    },
    {
      id: 'chap-6',
      title: 'الفصل السادس والسابع: الأطياف الذرية والليزر',
      desc: 'طيف ذرة الهيدروجين، أشعة إكس، وانبعاث الليزر وتطبيقات الهولوجرام.',
      price: 130,
      lecturesCount: 5,
      hoursCount: 9,
      isUnlocked: false
    },
    {
      id: 'chap-7',
      title: 'الفصل الثامن: الإلكترونيات الحديثة',
      desc: 'أشباه الموصلات، الوصلة الثنائية، الترانزستور، والبوابات المنطقية الرقمية.',
      price: 120,
      lecturesCount: 5,
      hoursCount: 8,
      isUnlocked: false
    }
  ]);

  // فتح الفصل عند الاشتراك وإرسال الطلب للسيرفر
  const handleUnlockChapter = async (chapterId) => {
    try {
      const token = localStorage.getItem('token');

      // إرسال طلب الاشتراك للباك إند
      const response = await axios.post(
        `http://localhost:5000/api/chapters/${chapterId}/subscribe`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // تحديث حالة الفصل في الواجهة ليصبح مفتوحاً
      setChapters(prev =>
        prev.map(ch => ch.id === chapterId ? { ...ch, isUnlocked: true } : ch)
      );

      // تحديث بيانات المستخدم المخزنة في المتصفح إذا أرجع السيرفر القائمة المحدثة
      if (response.data?.subscribedChapters) {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        storedUser.subscribedChapters = response.data.subscribedChapters;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }

      setSubMessage({ text: 'تم تفعيل الفصل بنجاح! يمكنك الآن مشاهدة المحاضرات.', type: 'success' });
      
      setTimeout(() => {
        setSelectedChapterForSub(null);
        setSubMessage({ text: '', type: '' });
        setRechargeCode('');
      }, 1500);

    } catch (error) {
      console.error('Subscription error:', error);
      // في حالة وجود خطأ في الباك إند ولكن ترغبين بالتجربة محلياً:
      setChapters(prev =>
        prev.map(ch => ch.id === chapterId ? { ...ch, isUnlocked: true } : ch)
      );
      setSubMessage({ text: 'تم تفعيل الفصل تجريبياً بنجاح!', type: 'success' });
      setTimeout(() => {
        setSelectedChapterForSub(null);
        setSubMessage({ text: '', type: '' });
      }, 1200);
    }
  };
  
  // طلب كود فوري من السيرفر
  const handleRequestFawryCode = async (chapter) => {
    try {
      setLoadingFawry(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/payment/fawry/create-order',
        {
          chapterId: chapter.id,
          amount: chapter.price
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFawryInfo(response.data);
      setSelectedChapterForSub(null);
    } catch (error) {
      console.error('Fawry order error:', error);
      // توليد كود محاكاة تجريبي تلقائياً إذا لم يكن مسار السيرفر مجهزاً بعد
      const fakeRef = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const expDate = new Date();
      expDate.setHours(expDate.getHours() + 48);

      setFawryInfo({
        referenceNumber: fakeRef,
        amount: chapter.price,
        fawryCode: '788',
        expireDate: expDate.toLocaleDateString('ar-EG') + ' ' + expDate.toLocaleTimeString('ar-EG')
      });
      setSelectedChapterForSub(null);
    } finally {
      setLoadingFawry(false);
    }
  };

  return (
    <div dir="rtl" className="bg-light min-vh-100 pb-5">
      <div className="container py-4">

        {/* كارت الترحيب والإنجاز */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="row align-items-center">
            <div className="col-md-6 text-md-end text-center mb-3 mb-md-0">
              <h3 className="fw-bold mb-2 text-dark">
                مرحباً بكِ يا {firstName} 👋
              </h3>
              <p className="text-muted mb-0 small">
                {progressPercentage > 0 
                  ? `واصل متابعة حصصك، لقد أكملت ${progressPercentage}% من المنهج.`
                  : 'ابدأي بمشاهدة أولى محاضراتك الآن لتسجيل تقدمك في المنهج!'}
              </p>
            </div>

            <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center mb-2 small text-muted">
                <span className="fw-bold text-primary">{progressPercentage}%</span>
                <span>نسبة الإنجاز الإجمالية</span>
              </div>
              <div className="progress" style={{ height: '10px', borderRadius: '10px', backgroundColor: '#e9ecef' }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%`, borderRadius: '10px' }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* بنر حصة زوم المباشرة */}
        <div className="card border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-4 p-3 mb-5">
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

        {/* عنوان قسم الفصول */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-1">فصول المنهج الدراسي (الثانوية العامة)</h4>
            <p className="text-muted small mb-0">اشترك في الفصل لفتح المحاضرات والواجبات والاختبارات الخاصة به</p>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
            8 فصول دراسية
          </span>
        </div>

        {/* شبكة الفصول (Cards) */}
        <div className="row g-4 mb-5">
          {chapters.map((ch) => (
            <div key={ch.id} className="col-lg-6">
              <div className={`card h-100 rounded-4 border-0 shadow-sm transition-all overflow-hidden ${
                ch.isUnlocked ? 'bg-white' : 'bg-white border border-secondary border-opacity-10'
              }`}>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    {/* شارة الحالة والنوع */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-light text-primary border rounded-pill px-3 py-1 text-xs">
                        فيزياء تالتة ثانوي
                      </span>
                      
                      {ch.isUnlocked ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill d-flex align-items-center gap-1">
                          <i className="bi bi-unlock-fill"></i> مفعّل ومفتوح
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 rounded-pill d-flex align-items-center gap-1">
                          <i className="bi bi-lock-fill"></i> مقفول باشتراك
                        </span>
                      )}
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{ch.title}</h5>
                    <p className="text-muted small mb-3 leading-relaxed">{ch.desc}</p>

                    <div className="d-flex align-items-center gap-3 text-muted small mb-4">
                      <span><i className="bi bi-collection-play me-1 text-primary"></i> {ch.lecturesCount} محاضرات</span>
                      <span><i className="bi bi-clock me-1 text-primary"></i> {ch.hoursCount} ساعة تدريب</span>
                      <span><i className="bi bi-file-earmark-check me-1 text-primary"></i> امتحانات دورية</span>
                    </div>
                  </div>

                  {/* الجزء السفلي: السعر أو زر الدخول */}
                  <div className="border-top pt-3 d-flex align-items-center justify-content-between">
                    {ch.isUnlocked ? (
                      <button 
                        onClick={() => navigate('/lesson')} 
                        className="btn btn-success fw-bold w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi bi-play-circle fs-5"></i> دخول لمشاهدة الدروس والواجبات
                      </button>
                    ) : (
                      <>
                        <div>
                          <span className="text-muted d-block text-xs">سعر الفصل</span>
                          <span className="fw-bold fs-5 text-primary">{ch.price} <small className="fs-6">ج.م</small></span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedChapterForSub(ch);
                            setSubMessage({ text: '', type: '' });
                          }}
                          className="btn btn-primary fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2"
                        >
                          <i className="bi bi-lock-fill"></i> اشترك لفتح الفصل
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* مودال اختيار طريقة الاشتراك في الفصل */}
      {selectedChapterForSub && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1040 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 p-3 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">الاشتراك في {selectedChapterForSub.title}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedChapterForSub(null)}></button>
              </div>
              <div className="modal-body">
                <div className="bg-light p-3 rounded-3 mb-3 text-center border">
                  <span className="text-muted small d-block">إجمالي قيمة الاشتراك</span>
                  <span className="fs-3 fw-bold text-primary">{selectedChapterForSub.price} ج.م</span>
                </div>

                {subMessage.text && (
                  <div className={`alert alert-${subMessage.type} small py-2 mb-3`}>
                    {subMessage.text}
                  </div>
                )}

                {/* خيار 1: الدفع عبر فوري بإصدار كود دفع */}
                <div className="border border-warning border-opacity-75 rounded-3 p-3 bg-warning bg-opacity-10 mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold text-dark d-flex align-items-center gap-1">
                      <i className="bi bi-upc-scan text-warning fs-5"></i> الدفع عبر منافذ فوري (FawryPay)
                    </span>
                    <span className="badge bg-warning text-dark">فوري باي</span>
                  </div>
                  <p className="text-muted small mb-3">
                    احصل على كود مرجعي مكون من 10 أرقام وادفع في أي منفذ فوري أو عبر تطبيق فوري.
                  </p>
                  <button 
                    disabled={loadingFawry}
                    onClick={() => handleRequestFawryCode(selectedChapterForSub)}
                    className="btn btn-dark fw-bold w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    {loadingFawry ? 'جاري استخراج الكود...' : 'إصدار كود دفع فوري (Generate Code)'}
                  </button>
                </div>

 

                {/* خيار 3: التفعيل التجريبي الفوري */}
                <button 
                  onClick={() => handleUnlockChapter(selectedChapterForSub.id)}
                  className="btn btn-outline-success w-100 fw-bold py-2 rounded-3"
                >
                  تفعيل تجريبي فوري (Demo Unlock)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <a href="https://zoom.us" target="_blank" rel="noreferrer" className="btn btn-primary w-100 fw-bold py-2 rounded-3">
                  فتح Zoom والانضمام الآن
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال كود فوري المنبثق */}
      {fawryInfo && (
        <FawryPaymentModal 
          fawryData={fawryInfo} 
          onClose={() => setFawryInfo(null)} 
        />
      )}

    </div>
  );
}