import { z } from 'zod';

export const addressSchema = z.object({
  name: z
    .string()
    .min(1, '배송지명을 입력하세요.')
    .max(30, '배송지명은 30자 이하여야 합니다.'),
  recipientName: z
    .string()
    .min(2, '수령인 이름을 입력하세요.')
    .max(50, '수령인 이름은 50자 이하여야 합니다.'),
  phone: z
    .string()
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 휴대폰 번호를 입력하세요.'),
  zipCode: z
    .string()
    .regex(/^[0-9]{5}$/, '올바른 우편번호를 입력하세요.'),
  address: z
    .string()
    .min(1, '주소를 입력하세요.')
    .max(200, '주소는 200자 이하여야 합니다.'),
  addressDetail: z
    .string()
    .max(100, '상세주소는 100자 이하여야 합니다.')
    .optional()
    .or(z.literal('')),
  isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
