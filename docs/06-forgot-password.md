# 패스워드 찾기

## ForgotPassword 페이지 만들기

- email을 입력받아서 user table에 존재하는지 확지
- 존재하지 않아도 일단 넘어감 (여길 이용해서 이메일 찾는것을 방지)
- 존재하면

  - cyrpto 를 이용하여 resetToken 만들기

    ```typescript
    const resetToken = crypto.randomBytes(20).toString('hex')
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const passwordResetExpires = Date.now() + 3600000 // 1h

    const resetUrl = `localhost:3000/reset-password/${resetToken}`
    ```

    user에 resetToken, resetTokenExpiry 설정

  - 메일 발송 Saas를 이용해서 발송 실패시 resetToken, expiry 리셋

## ResetPassword 페이지 만들기

- reset-password 페이지 들어오면

  - verify-token 실행

  ```
  user.findUnique({
  	where: {
  		resetToken: token,
  		resetTokenExpiry: { gt: Date.now() }
  	}
  })
  ```

  - 없으면 '잘못된 토큰이거나 만료되었습니다.'
  - 맞으면 user 정보 돌려주기

- 유저 정보로 set해서 패스워드 업뎃하기
