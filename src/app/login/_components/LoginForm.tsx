'use client'

/* eslint-disable react/jsx-props-no-spreading */
import { useSearchParams } from 'next/navigation'
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'
import useLoginForm from '../_hooks/useLoginForm'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const { methods, submitting, onSubmitHandler } = useLoginForm(callbackUrl)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Flex gap={2} direction="column">
        <FormControl isInvalid={!!errors.email}>
          <Input {...register('email')} placeholder="이메일" />
          <FormErrorMessage>
            {errors.email && errors.email?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <Input type="password" {...register('password')} placeholder="암호" />
          <FormErrorMessage>
            {errors.password && errors.password?.message}
          </FormErrorMessage>
        </FormControl>
        <FormErrorMessage>
          {errors.root && errors.root?.message}
        </FormErrorMessage>

        <Button
          maxW="100%"
          mt={2}
          type="submit"
          isLoading={submitting}
          colorScheme="teal"
        >
          {submitting ? '로딩...' : '로그인'}
        </Button>
      </Flex>
    </form>
  )
}
