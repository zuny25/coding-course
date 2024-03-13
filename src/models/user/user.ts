export interface User {
  id: string
  name: string
  email: string
  role: 'member' | 'admin'
  createdAt: Date
}

export interface UserForgetPassword {
  id: string
  resetToken?: string
  resetTokenExpiry?: Date
}
