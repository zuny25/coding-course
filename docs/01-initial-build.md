# 기본 세팅

1. next.js 초기 세팅을 위해 커맨드 창에서 npx로 생성하기

   ```
    npx create-next-app@latest
   ```

   ```
    Ok to proceed? (y)
   ✔ What is your project named? … coding-course
   ✔ Would you like to use TypeScript? …  Yes
   ✔ Would you like to use ESLint? …  Yes
   ✔ Would you like to use Tailwind CSS? …  No
   ✔ Would you like to use `src/` directory? …   Yes
   ✔ Would you like to use App Router? (recommended) …  Yes
   ✔ Would you like to customize the default import alias (@/*)? … No
   ```

   CSS는 추후 변경이 가능하며 여기서는 module css를 사용합니다.

2. docker 설치

   - [docker](https://www.docker.com/) 에 접속하여 사용환경에 맞는 docker를 설치 후 실행
   - docker-compose.yml을 통해 docker 이미지로 mysql 서비스 실행
   - 이를 통해 따로 로컬에 DB를 설치할 필요없이 사용이 가능합니다.
   - 프로젝트 루트 폴더에서
     ```
      docker-compose up -d
     ```
     -d는 데몬 옵션으로 백그라운드에서 계속 돌아가도록 설정하는 옵션입니다.

3. lint 적용
   - Dependency 설치
   ```
   yarn add prettier eslint-config-airbnb eslint-config-airbnb-typescript eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
   ```
   - package 스크립트에 린트와 prettier 추가
   ```
    "format": "prettier --check --ignore-path .gitignore .",
   "format:fix": "prettier --write --ignore-path .gitignore .",
   ```
   - eslint 룰 추가
     .eslintrc.json에 다음 내용추가
     ```
     {
     	"extends": [
     		"next/core-web-vitals",
     		"airbnb",
     		"airbnb-typescript",
     		"prettier"
     	],
     	"parserOptions": {
     		"project": "./tsconfig.json"
     	},
     	"rules": {
     		"react/react-in-jsx-scope": "off",
     		"react/require-default-props": "off",
     		"react/no-array-index-key": "off",
     		"jsx-a11y/label-has-associated-control": [
     			2,
     			{
     				"labelAttributes": ["htmlFor"],
     				"depth": 3
     			}
     		],
     		"@typescript-eslint/no-unused-vars": [
     			"error",
     			{ "argsIgnorePattern": "^_" }
     		]
     	}
     }
     ```
   - .prettierrc 추가
   ```
   {
   	"semi": false,
   	"singleQuote": true,
   	"trailingComma": "all",
   	"useTabs": false,
   	"tabWidth": 2,
   	"printWidth": 80,
   	"arrowParens": "always"
   }
   ```
   - 린트 전체 적용
   ```
   yarn format:fix
   ```
