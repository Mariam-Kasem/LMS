import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer dir="rtl" className="bg-white border-top py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center gy-3">
          
          {/* حقوق المنصة والجهة التعليمية */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <p className="mb-0 text-secondary small">
              &copy; {currentYear} <strong className="text-dark">منصة فيزياء المستقبل</strong>. جميع الحقوق محفوظة.
            </p>
          </div>

          {/* حقوق الملكية والبرمجة */}
          <div className="col-12 col-md-6 text-center text-md-end">
            <p className="mb-0 text-secondary small">
              تم التطوير بواسطة{' '}
              <a
                href="https://github.com/Mariam-Kasem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary fw-bold text-decoration-none"
              >
                Mariam Kassem
              </a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}