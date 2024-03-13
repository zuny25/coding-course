type ErrorName = 'DUPLICATION_ON_CREATE' | 'ERROR_ON_UPDATE'

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
