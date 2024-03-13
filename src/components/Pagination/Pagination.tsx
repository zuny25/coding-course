import PageLink from './PageLink'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
}

function getPaginationModifier(currentPage: number, totalPages: number) {
  if (totalPages <= 5 || currentPage <= 2) {
    return 1
  }
  if (currentPage + 2 > totalPages) {
    return totalPages - 4
  }
  return currentPage - 2
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
}: Props) {
  if (totalItems === 0) {
    return null
  }
  const modifier = getPaginationModifier(currentPage, totalPages)

  return (
    <section>
      <PageLink page={currentPage - 1} disabled={currentPage === 1}>
        Prev
      </PageLink>
      <ul>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
          <li
            key={i}
            // className={clsx(currentPage === modifier + i && styles.active)}
          >
            <PageLink page={modifier + i}>{modifier + i}</PageLink>
          </li>
        ))}
      </ul>
      <PageLink page={currentPage + 1} disabled={currentPage === totalPages}>
        Next
      </PageLink>
    </section>
  )
}
