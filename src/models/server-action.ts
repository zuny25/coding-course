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
