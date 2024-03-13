import { TypeOf, object, string } from 'zod'

export const loginUserSchema = object({
  email: string({ required_error: '이메일을 입력하세요.' })
    .min(1, '이메일을 입력하세요.')
    .email('잘못된 이메일 포맷입니다.'),
  password: string({ required_error: '암호를 입력하세요.' }).min(
    1,
    '암호를 입력하세요.',
  ),
})

export type LoginUserInput = TypeOf<typeof loginUserSchema>
