import { TypeOf, object, string } from 'zod'

export const resetPasswordSchema = object({
  id: string({ required_error: 'id는 필수값입니다.' }).min(
    1,
    'id는 필수값입니다.',
  ),
  password: string({ required_error: '암호는 필수값입니다.' })
    .min(1, '암호는 필수값입니다.')
    .min(8, '암호는 8글자 이상이어야 합니다.')
    .max(32, '암호는 32글자 이하이어하 합니다.'),
  passwordConfirm: string({
    required_error: '암호를 재입력해 주세요.',
  }).min(1, '암호를 재입력해 주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: '암호가 일치하지 않습니다.',
})

export type ResetPasswordUserInput = TypeOf<typeof resetPasswordSchema>
