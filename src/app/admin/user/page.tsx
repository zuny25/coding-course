import Pagination from '@/components/Pagination/Pagination'
import searchUserList from '@/data-access/user/searchUserList'
import { Flex } from '@chakra-ui/react'
import UserList from './_components/UserList'
import SearchUser from './_components/SearchUser'

export default async function AdminUserListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { page = '1', size = '10', name, email } = searchParams
  const params = {
    page: parseInt(page, 10),
    size: parseInt(size, 10),
    name,
    email,
  }

  const { items, currentPage, totalPages, totalItems } =
    await searchUserList(params)

  return (
    <Flex direction="column" mt={4}>
      <SearchUser />
      <UserList users={items} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </Flex>
  )
}
