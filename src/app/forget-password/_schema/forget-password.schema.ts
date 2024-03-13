import { TypeOf, object, string } from 'zod'

export const forgetPasswordSchema = object({
  email: string({ required_error: '이메일을 입력하세요.' })
    .min(1, '이메일을 입력하세요.')
    .email('잘못된 이메일 포맷입니다.'),
})

export type ForgetPasswordInput = TypeOf<typeof forgetPasswordSchema>
