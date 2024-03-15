import { User } from '@/models/user/user'
import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import UserItem from './UserItem'

interface Props {
  users: User[]
}

export default function UserList({ users }: Props) {
  return (
    <TableContainer mt={2} mb={2}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>이름</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>가입일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
