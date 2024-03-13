export interface User {
  id: string
  name: string
  email: string
  role: 'member' | 'admin'
  createdAt: Date
}
