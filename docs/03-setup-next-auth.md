# Next-auth 세팅

- Next-Auth는 next.js에서 쉽게 로그인을 구현해줄 수 있도록 도와주는 라이브러리입니다.
- 현재 App router에서 정상적으로 사용하기 위해서는 5.0.0beta 이상의 버전을 사용합니다.
- beta이긴 하나 사용하는데 큰 이슈는 없습니다.

## 1. 기본 세팅

1. 우선 라이브러리를 설치합니다.
   ```
   yarn add next-auth@beta @auth/prisma-adapter
   ```
2. src 디렉토리에 auth.ts, auth.config.ts를 만듭니다.

   - auth.ts는 각 로그인 Provider에 대한 설정과 필요한 핸들러들을 NextAuth에서 export 합니다.
   - auth.config.ts 에서는 그외 config에 대한 정보를 저장합니다.
   - auth.ts 하나로 해도 되지만 파일이 길어지고 관심사 분리를 위해 파일을 분리합니다.

   ```typescript
   // auth.ts
   import NextAuth from 'next-auth'
   import authConfig from './auth.config'

   export const { handlers, auth, signIn, signOut } = NextAuth({
     ...authConfig,
     providers: [],
   })
   ```

   ```typescript
   // auto.config.ts
   import { NextAuthConfig } from 'next-auth'

   const authConfig = {
     session: { strategy: 'jwt' },
     pages: {},
     providers: [],
     callbacks: [],
   } satisfies NextAuthConfig

   export default authConfig
   ```

3. NextAuth는 dynamic api routes를 이용하여 로그인과 관련된 api들을 핸들링합니다. 해당 API를 세팅합니다.

   1. src/app 디렉토리에 `api/auth/[...nextauth]` 경로로 디렉토리를 생성합니다.
   2. 'route.ts' 파일을 만듭니다.

   ```typescript
   // route.ts
   import { handlers } from '@/auth'

   export const { GET, POST } = handlers
   ```

4. .env 또는 .env.local에 Auth와 관련된 환경변수를 추가합니다.
   ```env
   AUTH_SECRET=my_auth_secret
   NEXTAUTH_URL=http://localhost:3000/api/auth
   ```

### 2. Prisma 연동

NextAuth에 Prisma를 연동하여 로그인및 회원 가입에 필요한 정보를 저장합니다.

1. Next.js에서 매번 db 요청이 있을때마다 새로운 클라이언트를 생성하는것보다 하나의 클라이언트로 리퀘스트를 처리하는것이 효율적이고 안전합니다.

   - `src/lib/prismaClient.ts` 파일을 만듭니다.

   ```typescript
   // prismaClient.ts
   import { PrismaClient } from '@prisma/client'

   function prismaSingleton() {
     if (process.env.NODE_ENV === 'production') {
       return new PrismaClient()
     }
     const globalWithPrismaClient = global as typeof globalThis & {
       prisma: PrismaClient
     }
     if (!globalWithPrismaClient.prisma) {
       globalWithPrismaClient.prisma = new PrismaClient()
     }
     return globalWithPrismaClient.prisma
   }

   export default prismaSingleton()
   ```

2. https://authjs.dev/reference/adapter/prisma 를 참조하여 schema를 선언합니다.

   ```prisma
   // schema.prisma
   enum Roles {
   	admin
   	member
   }
   model User {
   	id            String    @id @default(uuid())
   	name          String
   	email         String?   @unique
   	password      String?
   	image         String?
   	role          Roles     @default(member)
   	emailVerified DateTime? @map("email_verified")
   	createdAt     DateTime  @default(now())
   	updatedAt     DateTime  @updatedAt
   	accounts      Account[]
   	sessions      Session[]

   	@@map("users")
   }

   model Account {
   	id                String   @id @default(cuid())
   	userId            String   @map("user_id")
   	type              String?
   	provider          String
   	providerAccountId String   @map("provider_account_id")
   	token_type        String?
   	refresh_token     String?  @db.Text
   	access_token      String?  @db.Text
   	expires_at        Int?
   	scope             String?
   	id_token          String?  @db.Text
   	createdAt         DateTime @default(now())
   	updatedAt         DateTime @updatedAt
   	user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

   	@@unique([provider, providerAccountId])
   	@@map("accounts")
   }

   model Session {
   	id           String   @id @default(cuid())
   	userId       String?  @map("user_id")
   	sessionToken String   @unique @map("session_token")
   	accessToken  String?  @map("access_token") @db.Text
   	expires      DateTime
   	user         User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
   	createdAt    DateTime @default(now())
   	updatedAt    DateTime @updatedAt

   	@@map("sessions")
   }

   model VerificationRequest {
   	id         String   @id @default(cuid())
   	identifier String
   	token      String   @unique
   	expires    DateTime
   	createdAt  DateTime @default(now())
   	updatedAt  DateTime @updatedAt

   	@@unique([identifier, token])
   }

   ```

   - User에 Role정보는 사용자의 권한을 체크하기 위해 넣은 custom field입니다.
   - prisma 스크립트를 실행하여 db에 적용합니다.

   ```
   npx prisma migrate dev --name init
   ```

3. 시드 생성

   - next-auth는 사용자 로그인만 관여할뿐 사용자 등록은 해주지 않습니다.(Credential Provider 기준)
   - 초기 어드민 계정을 생성을 위해 seed파일을 생성합니다.

   1. seed전에 credentail provider의 패스워드를 암호화 하여 저장하기 위해여 관련 라이브러리들을 설치합니다.

   ```
   yarn add bcryptjs
   yarn add @types/bcryptjs -D
   ```

   1. prisma 디렉토리 내에 prisma.ts를 생성합니다.

   ```typescript
   import { PrismaClient } from '@prisma/client'
   import { hash } from 'bcryptjs'

   const prisma = new PrismaClient()

   async function main() {
     const password = await hash('admin', 12)
     const user = await prisma.user.upsert({
       where: { email: 'admin@admin.com' },
       update: {},
       create: {
         email: 'admin@admin.com',
         role: 'admin',
         name: 'Admin',
         password,
       },
     })
     console.log({ user })
   }
   main()
     .then(() => prisma.$disconnect())
     .catch(async (e) => {
       console.error(e)
       await prisma.$disconnect()
       process.exit(1)
     })
   ```

   2. Prisma를 이용해 시드하기 위해 package.json에 다음 항목을 추가합니다.

   ```json

     "prisma": {
   		"seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
   	}

   ```

   3. ts-node를 설치합니다.

   ```
   yarn add ts-node -D
   ```

   4. 실행하여 잘 Seeding이 되는지 확인합니다.

   ```
   npx prisma db seed
   ```

### 3. Credential Provider 설정

1. Credential Provider는 DB에 등록된 id 또는 email과 password를 비교하여 로그인을 수락하는 방식입니다. 이를 위해서 prisma에서 email을 이용하여 특정 유저를 찾는 data-access 함수를 만듭니다.

   ```typescript
   // models/auth/auth-user.ts
   export interface AuthUser {
     id: string
     name: string
     email: string
     password?: string
     role: 'member' | 'admin'
   }
   ```

   ```typescript
   // data-access/auth/findAuthUserByEmail.ts

   import prismaClient from '@/lib/prismaClient'
   import { User as PUser } from '@prisma/client'
   import { AuthUser } from '@/models/auth/auth-user'

   function mapPrismaUserToAuthUser(user: PUser): AuthUser {
     return {
       id: user.id,
       name: user.name,
       email: user.email !== null ? user.email : '',
       password: user.password !== null ? user.password : undefined,
       role: user.role,
     }
   }

   export default async function findUserByEmail(
     email: string,
   ): Promise<AuthUser | undefined> {
     const user = await prismaClient.user.findUnique({
       where: {
         email,
       },
     })

     if (user === null) return undefined

     return mapPrismaUserToAuthUser(user)
   }
   ```

2. auth.config.ts에 prisma adapter를 추가합니다. 또한 세션 유저정보에 유저 role을 추가로 돌려주도록 설정합니다.

```typescript
// auth.config.ts

import { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prismaClient'

import findUserByEmail from '@/data-access/auth/findAuthUserByEmail'

const authConfig = {
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  pages: {
    // signIn: '/login',
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      const users = await findUserByEmail(session.user.email)
      return {
        ...session,
        user: {
          ...session.user,
          id: typeof token.id === 'string' ? token.id : undefined,
          role: users?.role,
        },
      }
    },
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        }
      }
      return token
    },
  },
} satisfies NextAuthConfig

export default authConfig
```

2. auth.ts 에 Provider를 추가합니다.

```typescript
// auth.ts

import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import findUserByEmail from '@/data-access/auth/findAuthUserByEmail'
...
providers: [
	CredentialsProvider({
		name: 'Sign in',
		id: 'credentials',
		credentials: {
			email: {
				label: 'Email',
				type: 'email',
				placeholder: 'example@example.com',
			},
			password: { label: 'Password', type: 'password' },
		},
		async authorize(credentials) {
			if (!credentials?.email || !credentials.password) {
				return null
			}

			const user = await findUserByEmail(String(credentials.email))

			if (
				!user ||
				!(await bcrypt.compare(String(credentials.password), user.password!))
			) {
				return null
			}

			return {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			}
		},
	}),
...
```

### 4. 확인

- 제대로 동작하는지 확인하기 위해서 서버를 띄워봅니다.
  ```
  yarn dev
  ```
- [localhost:3000/api/auth/signin](http://localhost:3000/api/auth/signin) 로 들어갑니다.(해당링크는 next-auth 기본 로그인 화면입니다.)
- seed로 넣은 admin계정 정보를 입력합니다.
- main 화면으로 정상적으로 돌아가면 성공
- 계정 정보가 정확히 있는지 확인하기 위해서 컴포넌트에서 확인해 봅니다.

  - app/\_components/header.ts 파일 생성

  ```typescript
  import { auth, signOut } from '@/auth'
  import Link from 'next/link'

  export default async function Header() {
  	const session = await auth()
  	const user = session?.user

  	const logoutAction = async () => {
  		'use server'

  		await signOut()
  	}
  	console.log(user)

  	return (
  		<header>
  			<section>CodingCourse</section>
  			{!user && (
  				<>
  					<Link href="/join">가입하기</Link>
  					<Link href="/login">로그인하기</Link>
  				</>
  			)}
  			{user && (
  				<form action={logoutAction}>
  					<button type="submit">Lougout</button>
  				</form>
  			)}
  		</header>
  	)
  }
  ```

  - 그런데 vscode에서 user를 직접적으로 사용하려면 콘솔에 찍히는것과 다르게 role을 접근할 수 없고 에러가 납니다. 이를 해결하기 위해서 nextauth.d.ts 를 선언합니다.

  ```typescript
  // nextauth.d.ts

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import NextAuth from 'next-auth/next'

  declare module 'next-auth' {
    interface Session {
      user: {
        id: string
        name: string
        email: string
        image?: string
        role: string
      }
    }
  }
  ```

### 5. Google과 Github Provider추가

auth.ts파일에 구글과 깃헙 프로바이더를 설정합니다.

```typescript
// auth.ts

import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

...
providers: [
	...
	GoogleProvider({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	}),
	GitHubProvider({
		clientId: process.env.GITHUB_ID,
		clientSecret: process.env.GITHUB_SECRET,
	}),
]
```

각각 서비스에서 OAuth 앱을 설정한 다음 해당 정보를 .env파일에 추가합니다.

> [!Caution]
> .env파일이 gitignore되어있는지 확인합니다. 해당 정보는 깃에 절대 올라가서는 안됩니다.

기본적인 callback 주소는

- google: http://localhost:3000/api/auth/callback/google
- github: http://localhost:3000/api/auth/callback/github

입니다.

#### Google OAuth

- 구글클라우드에 접속 https://console.cloud.google.com
- 새 프로젝트 생성
- API 및 서비스 -> OAuth동의 화면
  - User Type 외부로 설정하고 만들기
  - 앱이름, 사용자 지원 이메일, 개발자 연락처 정보 입력후 저장후 계속
  - '범위'는 설정없이 저장 후 계속
  - '테스트 사용자' 설정없이 저장 후 계속
  - 대쉬보드로 돌아가기
- API 및 서비스 -> 사용자 인증 정보
  - 새 사용자 인증 정보 만들기
  - 웹 애플리케이션 선택
  - 승인된 자바스크립트 원본
    - http://localhost:3000
  - 승인된 리디렉션 URI
    - http://localhost:3000/api/auth/callback/google
- 생성된 클라이언트 ID, SECRET 세팅

#### Github OAuth

https://github.com/settings/developers 에서 설정
