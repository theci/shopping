import Link from 'next/link';
import { cn } from '@/shared/utils/cn';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('bg-gray-900 text-gray-300', className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">E-Commerce</h3>
            <p className="text-sm text-gray-400 mb-4">
              최고의 쇼핑 경험을 제공하는 이커머스 플랫폼
            </p>
            <div className="text-sm text-gray-400 space-y-1">
              <p>상호명: (주)이커머스</p>
              <p>대표: 홍길동</p>
              <p>사업자등록번호: 123-45-67890</p>
              <p>통신판매업신고: 제2024-서울강남-00000호</p>
            </div>
          </div>

          {/* 고객 서비스 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              고객 서비스
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  고객센터
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  배송 안내
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  반품/교환
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              이용 정책
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
