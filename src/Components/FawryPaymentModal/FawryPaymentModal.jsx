import React from 'react';

export default function FawryPaymentModal({ fawryData, onClose }) {
  if (!fawryData) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
        <div className="modal-content rounded-4 border-0 p-4 shadow text-center position-relative">
          
          <h5 className="fw-bold mb-1 text-dark">Pay Now</h5>
          <small className="text-muted d-block mb-3">الدفع عبر منافذ فوري</small>

          {/* المبلغ */}
          <div className="mb-3">
            <span className="fs-6 text-muted fw-bold">EGP </span>
            <span className="display-6 fw-bold text-dark">{fawryData.amount}</span>
          </div>

          {/* البنر التوضيحي لفوري */}
          <div className="bg-light p-3 rounded-3 mb-3 border">
            <span className="badge bg-warning text-dark mb-2 px-3 py-1">فوري باي (FawryPay)</span>
            <div className="small text-muted">توجه لأي ماكينة فوري واطلب الدفع بكود الخدمة</div>
          </div>

          {/* كود فوري المرجعي */}
          <div className="my-3">
            <label className="text-muted small fw-bold d-block mb-2">Fawry Reference Number</label>
            <div className="p-3 bg-light border border-2 border-primary border-opacity-25 rounded-3">
              <span className="fs-3 fw-bold text-primary letter-spacing-2" style={{ letterSpacing: '3px' }}>
                {fawryData.referenceNumber}
              </span>
            </div>
            <small className="text-danger d-block mt-2 font-monospace">
              تاريخ الانتهاء: {fawryData.expireDate}
            </small>
          </div>

          {/* إرشادات الدفع */}
          <div className="alert alert-success border-0 small text-start py-2 px-3 rounded-3 mb-4">
            <i className="bi bi-info-circle me-1"></i>
            توجه لأقرب منفذ فوري واطلب الدفع عبر كود خدمة <strong>{fawryData.fawryCode || '788'}</strong> باستخدام الرقم المرجعي الموضح أعلاه. سيتم فتح الكورس فور السداد تلقائياً.
          </div>

          <button 
            onClick={onClose} 
            className="btn btn-primary w-100 py-2 rounded-3 fw-bold"
            style={{ backgroundColor: '#5c469c', borderColor: '#5c469c' }}
          >
            حسناً (تم الحفظ)
          </button>
        </div>
      </div>
    </div>
  );
}