'use client'

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react'
/* eslint-disable react/jsx-props-no-spreading */
import useRegisterForm from '../_hooks/useRegisterForm'

export default function RegisterForm() {
  const { methods, submitting, onSubmitHandler } = useRegisterForm()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <Flex gap={2} direction="column">
        <FormControl isInvalid={!!errors.name}>
          <Input {...register('name')} placeholder="이름" />
          <FormErrorMessage>
            {errors.name && errors.name?.message}
          </FormErrorMessage>
        </FormControl>
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
        <FormControl isInvalid={!!errors.passwordConfirm}>
          <Input
            type="password"
            {...register('passwordConfirm')}
            placeholder="암호 확인"
          />
          <FormErrorMessage>
            {errors.passwordConfirm && errors.passwordConfirm?.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          maxW="100%"
          mt={2}
          type="submit"
          isLoading={submitting}
          colorScheme="teal"
        >
          {submitting ? '로딩...' : '가입하기'}
        </Button>
      </Flex>
    </form>
  )
}
