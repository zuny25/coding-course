'use client'

import useUpdateSearchParam from '@/lib/hooks/useUpdateSearchParam'
import { Container, Flex, Input, Select } from '@chakra-ui/react'
import { useState } from 'react'

export default function SearchUser() {
  const [field, setField] = useState<string>('email')
  const [query, setQuery] = useState<string>('')
  const updateParams = useUpdateSearchParam()

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.nativeEvent.isComposing) {
      return
    }
    if (event.key === 'Enter') {
      updateParams({
        key: field,
        value: query,
        resetPagination: true,
        clearQueries: true,
      })
    }
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setField(event.target.value)
  }

  return (
    <Container maxW="container.m" p={0}>
      <Flex gap={2}>
        <Select width="150px" onChange={handleSelect} value={field}>
          <option value="email">email</option>
          <option value="user">user</option>
        </Select>
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </Flex>
    </Container>
  )
}
