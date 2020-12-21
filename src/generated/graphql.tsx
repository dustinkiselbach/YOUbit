import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Credential = {
  __typename?: 'Credential';
  accessToken: Scalars['String'];
  client: Scalars['String'];
  expiry: Scalars['Int'];
  tokenType: Scalars['String'];
  uid: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** An example field added by the generator */
  testField: Scalars['String'];
  userLogin?: Maybe<UserLoginPayload>;
  userLogout?: Maybe<UserLogoutPayload>;
  userSendPasswordReset?: Maybe<UserSendPasswordResetPayload>;
  userSignUp?: Maybe<UserSignUpPayload>;
  userUpdatePassword?: Maybe<UserUpdatePasswordPayload>;
};


export type MutationUserLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUserSendPasswordResetArgs = {
  email: Scalars['String'];
  redirectUrl: Scalars['String'];
};


export type MutationUserSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  confirmSuccessUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationUserUpdatePasswordArgs = {
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  currentPassword?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** An example field added by the generator */
  testField: Scalars['String'];
  userCheckPasswordToken: User;
};


export type QueryUserCheckPasswordTokenArgs = {
  resetPasswordToken: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
};

/** Autogenerated return type of UserLogin */
export type UserLoginPayload = {
  __typename?: 'UserLoginPayload';
  authenticatable: User;
  credentials: Credential;
};

/** Autogenerated return type of UserLogout */
export type UserLogoutPayload = {
  __typename?: 'UserLogoutPayload';
  authenticatable: User;
};

/** Autogenerated return type of UserSendPasswordReset */
export type UserSendPasswordResetPayload = {
  __typename?: 'UserSendPasswordResetPayload';
  message: Scalars['String'];
};

/** Autogenerated return type of UserSignUp */
export type UserSignUpPayload = {
  __typename?: 'UserSignUpPayload';
  /** Authentication credentials. Null if after signUp resource is not active for authentication (e.g. Email confirmation required). */
  credentials?: Maybe<Credential>;
  user?: Maybe<User>;
};

/** Autogenerated return type of UserUpdatePassword */
export type UserUpdatePasswordPayload = {
  __typename?: 'UserUpdatePasswordPayload';
  authenticatable: User;
};

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name'>
);

export type UserCredentialsFragment = (
  { __typename?: 'Credential' }
  & Pick<Credential, 'accessToken' | 'client' | 'expiry' | 'tokenType' | 'uid'>
);

export type UserLoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type UserLoginMutation = (
  { __typename?: 'Mutation' }
  & { userLogin?: Maybe<(
    { __typename?: 'UserLoginPayload' }
    & { authenticatable: (
      { __typename?: 'User' }
      & RegularUserFragment
    ), credentials: (
      { __typename?: 'Credential' }
      & UserCredentialsFragment
    ) }
  )> }
);

export type UserSignUpMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  confirmSuccessUrl: Scalars['String'];
  name: Scalars['String'];
}>;


export type UserSignUpMutation = (
  { __typename?: 'Mutation' }
  & { userSignUp?: Maybe<(
    { __typename?: 'UserSignUpPayload' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, credentials?: Maybe<(
      { __typename?: 'Credential' }
      & UserCredentialsFragment
    )> }
  )> }
);

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  name
}
    `;
export const UserCredentialsFragmentDoc = gql`
    fragment UserCredentials on Credential {
  accessToken
  client
  expiry
  tokenType
  uid
}
    `;
export const UserLoginDocument = gql`
    mutation userLogin($email: String!, $password: String!) {
  userLogin(email: $email, password: $password) {
    authenticatable {
      ...RegularUser
    }
    credentials {
      ...UserCredentials
    }
  }
}
    ${RegularUserFragmentDoc}
${UserCredentialsFragmentDoc}`;
export type UserLoginMutationFn = Apollo.MutationFunction<UserLoginMutation, UserLoginMutationVariables>;

/**
 * __useUserLoginMutation__
 *
 * To run a mutation, you first call `useUserLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userLoginMutation, { data, loading, error }] = useUserLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUserLoginMutation(baseOptions?: Apollo.MutationHookOptions<UserLoginMutation, UserLoginMutationVariables>) {
        return Apollo.useMutation<UserLoginMutation, UserLoginMutationVariables>(UserLoginDocument, baseOptions);
      }
export type UserLoginMutationHookResult = ReturnType<typeof useUserLoginMutation>;
export type UserLoginMutationResult = Apollo.MutationResult<UserLoginMutation>;
export type UserLoginMutationOptions = Apollo.BaseMutationOptions<UserLoginMutation, UserLoginMutationVariables>;
export const UserSignUpDocument = gql`
    mutation userSignUp($email: String!, $password: String!, $passwordConfirmation: String!, $confirmSuccessUrl: String!, $name: String!) {
  userSignUp(
    email: $email
    password: $password
    passwordConfirmation: $passwordConfirmation
    confirmSuccessUrl: $confirmSuccessUrl
    name: $name
  ) {
    user {
      ...RegularUser
    }
    credentials {
      ...UserCredentials
    }
  }
}
    ${RegularUserFragmentDoc}
${UserCredentialsFragmentDoc}`;
export type UserSignUpMutationFn = Apollo.MutationFunction<UserSignUpMutation, UserSignUpMutationVariables>;

/**
 * __useUserSignUpMutation__
 *
 * To run a mutation, you first call `useUserSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userSignUpMutation, { data, loading, error }] = useUserSignUpMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      passwordConfirmation: // value for 'passwordConfirmation'
 *      confirmSuccessUrl: // value for 'confirmSuccessUrl'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUserSignUpMutation(baseOptions?: Apollo.MutationHookOptions<UserSignUpMutation, UserSignUpMutationVariables>) {
        return Apollo.useMutation<UserSignUpMutation, UserSignUpMutationVariables>(UserSignUpDocument, baseOptions);
      }
export type UserSignUpMutationHookResult = ReturnType<typeof useUserSignUpMutation>;
export type UserSignUpMutationResult = Apollo.MutationResult<UserSignUpMutation>;
export type UserSignUpMutationOptions = Apollo.BaseMutationOptions<UserSignUpMutation, UserSignUpMutationVariables>;