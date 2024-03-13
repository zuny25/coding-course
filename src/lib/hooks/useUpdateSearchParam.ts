import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useUpdateSearchParam() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const updateParams = ({
    key,
    value,
    resetPagination,
    clearQueries,
  }: {
    key: string
    value: string | string[]
    resetPagination: boolean
    clearQueries?: boolean
  }) => {
    const p = new URLSearchParams(clearQueries ? undefined : params)
    if (value === '' || value.length === 0) {
      p.delete(key)
    } else if (Array.isArray(value)) {
      p.delete(key)
      value.forEach((v) => p.append(key, v))
    } else {
      p.set(key, value)
    }
    if (resetPagination) {
      p.set('page', '1')
    }
    router.push(`${pathname}?${p.toString()}`)
  }

  return updateParams
}
