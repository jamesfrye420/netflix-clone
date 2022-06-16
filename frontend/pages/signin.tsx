import React, { useContext, useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

import type { NextPage } from 'next';

import { HeaderContainer } from '../src/containers/header';
import { FooterContainer } from '../src/containers/footer';
import { Form } from '../src/components';
import useUser from '../src/hooks/useUser';
import User from '../src/models/user';

interface SigninResponse {
  message: string;
  data?: {
    param: string;
    value: any;
    msg: any;
  };
  token: string;
  userId: string;
  User: User;
}

const Signin: NextPage = () => {
  const url = `${process.env.url}/auth/signin`;

  const router = useRouter();

  const User = useUser({
    redirectTo: '/browse/movies',
    redirectIfFound: true,
  });

  // const { userId, isLoading, error, isAuthenticated, setRedirectTo, setRedirectIfFound } = useContext(AuthContext);

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  const isInvalid = password === '' || emailAddress === '';

  const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setAuthLoading(true);
      const { data, status } = await axios.post<SigninResponse>(
        url,
        {
          email: emailAddress,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (status !== 200) {
        setAuthLoading(false);
        throw new Error('Could not authenticate you!');
      }

      //if the user is authenticated we get back a token, saving the token
      Cookies.set('token', data.token, { expires: 60 });
      setAuthLoading(false);
      router.push('/browse');
      //redirect
    } catch (error: any) {
      setAuthLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <HeaderContainer>
        <Form>
          <Form.Title>Sign In</Form.Title>
          {error && <Form.Error data-testid="error">{error}</Form.Error>}

          <Form.Base onSubmit={handleSignin} method="POST">
            <Form.Input
              type="email"
              placeholder="Email address"
              value={emailAddress}
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                setEmailAddress(target.value);
                setError('');
              }}
            />
            <Form.Input
              type="password"
              value={password}
              autoComplete="off"
              placeholder="Password"
              onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(target.value);
                setError('');
              }}
            />

            <Form.Submit disabled={isInvalid} type="submit">
              {authLoading ? '. . .' : 'Sign In'}
            </Form.Submit>
          </Form.Base>

          <Form.Text>
            New to Netflix?
            <NextLink href="/signup">
              <Form.Link>Sign up now.</Form.Link>
            </NextLink>
          </Form.Text>
          <Form.TextSmall>This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.</Form.TextSmall>
        </Form>
      </HeaderContainer>
      <FooterContainer />
    </>
  );
};

export default Signin;
