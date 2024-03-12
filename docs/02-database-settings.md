# 데이터베이스 세팅

- 이 프로젝트에서는 빠른 개발을 위해서 prisma를 사용합니다.


## 초기화
- prisma를 사용하기 위해 우선 prisma를 설치합니다.
  `yarn add prisma`
- npx를 이용하여 prisma를 초기화 합니다.
	`npx prisma init`

## Setting
- prisma/schema.prisma 파일을 열어서 provider를 변경합니다.
	```prisma
	// schema.prisma
	datasource db {
	  provider = "mysql"
	  url      = env("DATABASE_URL")
	}
	```
- .env파일에 DATABASE_URL을 추가합니다.
	```env
	DATABASE_URL="mysql://user:password@localhost:3306/db"
	```
  ```Docker
	DATABASE_URL="mysql://root:mysql@localhost:3306/coding"
	```

- (optional) gitignore에 .env를 포함하지 않도록 추가합니다.
	- 지금은 로컬 개발이라서 크게 상관이 없습니다.


## Test DB
- schema.prisma에 테스트용 모델을 추가합니다.
	```prisma
	// schema.prisma
	model User {
		id        String   @id @default(uuid())
		email     String   @unique
		name      String?
		password  String
		createdAt DateTime @default(now())
		updatedAt DateTime @updatedAt
	}
	```	
- prisma를 이용하여 테스트용 테이블을 생성합니다.
  ```
	npx prisma db push
	```

- db에 잘 들어갔는지 확인합니다.
 https://dev.mysql.com/downloads/workbench/ 를 이용하면 편하게 확인가능합니다.
 
