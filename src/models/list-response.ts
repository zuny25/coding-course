export interface ListResponse<T> {
  items: T[]
  currentPage: number
  totalPages: number
  totalItems: number
}
