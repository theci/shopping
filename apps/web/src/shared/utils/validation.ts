/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사 (8자 이상, 영문+숫자)
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * 전화번호 유효성 검사
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  return phoneRegex.test(phone.replace(/-/g, ''));
}

/**
 * 우편번호 유효성 검사
 */
export function isValidZipCode(zipCode: string): boolean {
  const zipCodeRegex = /^\d{5}$/;
  return zipCodeRegex.test(zipCode);
}

/**
 * 필수값 검사
 */
export function isRequired(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim() !== '';
}

/**
 * 최소 길이 검사
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.length >= minLength;
}

/**
 * 최대 길이 검사
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength;
}

/**
 * 숫자만 포함 검사
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * 한글 이름 유효성 검사 (2자 이상)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[가-힣]{2,}$/;
  return nameRegex.test(name);
}
