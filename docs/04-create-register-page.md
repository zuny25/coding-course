# 회원 가입 페이지 만들기

zod 와 react-hook-form 을 이용하여 회원가입 페이지 만들기

## 1. data-access와 model 만들기

models에 회원가입을 위한 Input 모델을 만들어줍니다.

```typescript
// models/auth/create-user-input.ts
import { AuthUser } from './auth-user'

export type CreateUserInput = Required<
  Pick<AuthUser, 'name' | 'email' | 'password'>
>
```

그리고 유저 생성을 위한 data-access 함수를 만들어줍니다.

```typescript
import { CreateUserInput } from '@/models/auth/create-user-input'
import prisma from '@/lib/prismaClient'
import { hash } from 'bcryptjs'
import { AuthUser } from '@/models/auth/auth-user'
import DataAccessError from '@/lib/serviceError'
import { Prisma } from '@prisma/client'
import mapPrismaUserToAuthUser from './_mapPrismaUserToAuthUser'

export default async function createUser({
  email,
  name,
  password,
}: CreateUserInput): Promise<Pick<AuthUser, 'name' | 'email'>> {
  try {
    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    const mappedUser = mapPrismaUserToAuthUser(user)

    return {
      email: mappedUser.email,
      name: mappedUser.name,
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        // Duplication
        throw new DataAccessError({
          name: 'DUPLICATION_ON_CREATE',
          message: '이미 사용중인 이메일 입니다.',
        })
      }
    }
    throw new Error('알수없는 에러입니다.')
  }
}
```

prisma는 자체적으로 DB에러를 핸들링하고 있습니다.
동일한 email의 경우 unique키값을 위반하기 때문에 에러가 발생합니다. 이를 받아서 처리하면 됩니다.
Prisma에서 에러를 핸들링 하는 방법은 [이곳](https://www.prisma.io/docs/orm/prisma-client/debugging-and-troubleshooting/handling-exceptions-and-errors)을 참고하세요.

위의 코드에서 커스텀 에러 객체로 DataAccessError를 만들었습니다. 이는 기존의 Error에 원하는 내용을 담기 어렵고 클래스 체크가 힘들기 때문입니다.

```typescript
// models/lib/serviceError.ts

type ErrorName = 'DUPLICATION_ON_CREATE'

export default class DataAccessError extends Error {
  name: ErrorName

  message: string

  cause: any

  constructor({
    name,
    message,
    cause,
  }: {
    name: ErrorName
    message: string
    cause?: any
  }) {
    super()
    this.name = name
    this.message = message
    this.cause = cause
  }
}

export function isDataAccessError(e: any): e is DataAccessError {
  return 'name' in e && 'message' in e
}
```

추후 server action을 통해 넘어갈 경우 plain object로 넘어가기 때문에 따로 타입가드가 필요합니다. 그렇기 때문에 `isDataAccessError`로 데이터 엑세스 에러인지 확인하는 타입가드를 만들어줍니다.

## 2. server action 만들기

서버 액션에서는 사용자가 입력한 값이 valid한지 체크하고 data-access를 통해 DB에 등록합니다.

### 2.1 server action 만들기

- `app/register/_actions`에 registerUser.ts파일을 생성합니다.
  이는 register page에서 사용되는 액션임을 나타냅니다.

  ```typescript
  //registerUser.ts
   'use server'

   import createUser from '@/data-access/auth/createUser'

  	interface Props = {
  		name: string;
  		email: string;
  		password: string;
  	}
  	export default async function registerUserAction(input: Props) {
  		const { name, email, password } = input
  		const user = await createUser({ name, email, password })
  		return user
  	}
  ```

### 2.2 zod를 이용해서 schema 확인

data-access에 보내지는 input값들은 valid한지 확인이 되어야 합니다. 이를 위해서 zod 라이브러리를 사용합니다.

```
yarn add zod
```

이제 회원가입을 위한 사용자 입력을 validate하기 위한 schema를 설정합니다.

```typescript
// app/register/_actions/schema/register-user-schema.ts
import { TypeOf, object, string } from 'zod'

export const registerUserSchema = object({
  name: string({ required_error: '이름은 필수값입니다.' }).min(
    1,
    '이름은 필수값입니다.',
  ),
  email: string({ required_error: '이메일은 필수값입니다.' })
    .min(1, '이메일은 필수값입니다.')
    .email('잘못된 이메일 포맷입니다.'),
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

export type RegisterUserInput = TypeOf<typeof registerUserSchema>
```

그리고 이를 action에 적용합니다.

```typescript
'use server'

import createUser from '@/data-access/auth/createUser'
import { ServerAction } from '@/models/server-action'

import {
  RegisterUserInput,
  registerUserSchema,
} from './schema/register-user-schema'

export default async function registerUserAction(input: RegisterUserInput) {
  const { name, email, password } = registerUserSchema.parse(input)
  const user = await createUser({ name, email, password })
  return user
}
```

### 2.3 client에서 사용하기 위헤서 server action wrapping하기

server action의 경우 현재 몇가지 제약사항이 있는데 하나는 plain object만 클라이언트로 보낼수 있으며, try/catch로 에러 메시지핸들링이 되지 않는다는 점입니다.
그렇기 때문에 현재 코드에서 createUser data-access에서 발생하는 에러를 처리하기가 어렵습니다. 이를 위해 Client에서 사용할 경우 Error를 핸들링 할 수 있도록 Wrapper를 만듭니다.

```typescript
// models/server-action.ts
import DataAccessError from '@/lib/serviceError'
import { ZodError } from 'zod'

export type ServerActionType = 'SUCCESS' | 'ERROR'

export interface ServerActionSuccess<T = {}> {
  type: 'SUCCESS'
  data?: T
}

export interface ServerActionError {
  type: 'ERROR'
  error: unknown
}

export type ServerActionResp<T = {}> =
  | ServerActionSuccess<T>
  | ServerActionError

export function isServerActionError(e: any): e is ServerActionError {
  return 'type' in e && e.type === 'ERROR'
}

export function isServerActionSuccess<T>(e: any): e is ServerActionSuccess<T> {
  return 'type' in e && e.type === 'SUCCESS'
}

export class ServerActionRespBuilder {
  static success<T = void>(data?: T): ServerActionSuccess<T> {
    return { type: 'SUCCESS', data }
  }

  static error(error: unknown): ServerActionError {
    return { type: 'ERROR', error }
  }
}

type GenericFunction = (...args: any[]) => any

type ServerActionWrapper<F extends GenericFunction> = (
  ...args: Parameters<F>
) => Promise<ServerActionResp<ReturnType<F>>>

export function ServerAction<F extends GenericFunction>(
  func: F,
): ServerActionWrapper<F> {
  return async (...args) => {
    try {
      const resp = await func(...args)
      return ServerActionRespBuilder.success(resp)
    } catch (e) {
      if (e instanceof ZodError || e instanceof DataAccessError) {
        return ServerActionRespBuilder.error({ ...e })
      }
      return ServerActionRespBuilder.error(e)
    }
  }
}
```

registerUserAction 을 업데이트 합니다.

```typescript
// app/register/_actions/registerUser.ts
...
export const registerUserActionClient = ServerAction(registerUserAction)
```

Server action을 사용해서 나온 결과를
isServerActionSuccess와 isServerActionError 타입가드를 이용하여 클라이언트에서 처리가 가능합니다. 해당 내용은 뒤에서 설명합니다.

## 3. react-hook-form으로 커스텀 훅 만들기

폼을 React에서 손쉽게 관리하기 위해서는 여러가지 방법이 있지만 여기서는 react-hook-form을 사용합니다.

```
yarn add @hookform/resolvers react-hook-form
```

기본적으로 custom hook에 form과 관련된 모든 설정을 해놓고 컴포넌트에서는 가져다 쓰기만 하는 방식으로 구현합니다.

```typescript
//app/register/_hooks/useRegisterForm.ts

import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  isServerActionError,
  isServerActionSuccess,
} from '@/models/server-action'
import { signIn } from 'next-auth/react'
import { isDataAccessError } from '@/lib/serviceError'

import { useTransition } from 'react'
import {
  RegisterUserInput,
  registerUserSchema,
} from '../_actions/schema/register-user-schema'

import { registerUserActionClient } from '../_actions/registerUser'

export default function useRegisterForm() {
  const [isPending, startTransition] = useTransition()
  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  })

  const onSubmitHandler: SubmitHandler<RegisterUserInput> = (values) => {
    startTransition(async () => {
      const res = await registerUserActionClient(values)
      if (isServerActionSuccess(res)) {
        signIn(undefined, { callbackUrl: '/' })
      }
      if (isServerActionError(res)) {
        const { error } = res

        if (
          isDataAccessError(error) &&
          error.name === 'DUPLICATION_ON_CREATE'
        ) {
          methods.setError('email', error)
        }
      }
    })
  }

  return {
    submitting: isPending,
    methods,
    onSubmitHandler,
  }
}
```

## 4. 회원가입 컴포넌트 생성 및 페이지 연동

```typescript
// app/register/_component/RegisterForm.tsx

'use client'

/* eslint-disable react/jsx-props-no-spreading */
import useRegisterForm from '../_hooks/useRegisterForm'

export default function RegisterForm() {
  const { methods, submitting, onSubmitHandler } = useRegisterForm()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div>
        <input {...register('name')} placeholder="이름" />
        {errors.name && <span> {errors.name?.message as string}</span>}
      </div>
      <div>
        <input {...register('email')} placeholder="이메일" />
        {errors.email && <span> {errors.email?.message as string}</span>}
      </div>
      <div>
        <input type="password" {...register('password')} placeholder="암호" />
        {errors.password && <span> {errors.password?.message as string}</span>}
      </div>
      <div>
        <input
          type="password"
          {...register('passwordConfirm')}
          placeholder="암호 확인"
        />
        {errors.passwordConfirm && (
          <span> {errors.passwordConfirm?.message as string}</span>
        )}
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? '로딩...' : '가입하기'}
      </button>
    </form>
  )
}
```

```typescript
// app/register/page.tsx
import RegisterForm from './_components/RegisterForm'

export default function RegisterPage() {
  return (
    <section>
      <RegisterForm />
    </section>
  )
}
```

구글과 깃헙은 가입과 로그인이 따로 분리되어 있지 않기 때문에 signIn함수 하나로 사용하면 됩니다.
뒤에 만일 SSO로 로그인 후 추가적으로 회원가입을 위해 기입해야 되는 정보가 있다면 User 테이블을 수정하고, auth에서 로그인 후 해당 정보가 없으면 추가정보를 기입하기 위한 페이지로 리다이렉트 시키는 방식으로 처리하면 됩니다.

## 5. login페이지 생성

auth.config.ts 에 속성중에 pages 설정을 통해 직접 커스텀 로그인 페이지 생성이 가능합니다.

```typescript
// auth.config.ts

const authConfig = {
	...
	pages: {
		signIn: '/login'
	}
}
```

login page는 회원가입 페이지와 동일하여 설명은 생력합니다. 다만, 이미 next-auth에서 필요한 함수들을 지원하기 때문에 data-access는 따로 만들지 않습니다.
