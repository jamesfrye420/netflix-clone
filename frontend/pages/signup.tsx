import React, { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

import type { NextPage } from 'next';

import { HeaderContainer } from '../src/containers/header';
import { FooterContainer } from '../src/containers/footer';
import { Form } from '../src/components';
import EmailContext from '../store/email-context';
import User from '../src/models/user';
import { useUser } from '../src/hooks';

interface SignupResponse {
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

const Signup: NextPage = () => {
  const url = `${process.env.url}/auth/signup`;
  const router = useRouter();
  // const authCtx = useContext(AuthContext);

  const { isValidating } = useUser({
    redirectTo: '/browse/movies',
    redirectIfFound: true,
  });

  const { email, setEmail } = useContext(EmailContext);

  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const isInvalid = firstName === '' || password === '' || email === '';

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setAuthLoading(true);
      const response = await axios.put<SignupResponse>(
        url,
        {
          firstName,
          email,
          password,
          photoURL: Math.floor(Math.random() * 5) + 1,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 201) {
        setAuthLoading(false);
        throw new Error('Could not signup');
      }
      //if the user is authinticed we get back a token, saving the token
      const now = new Date().getTime();
      Cookies.set('token', response.data.token, { expires: 23 });

      localStorage.setItem('userId', response.data.token);
      localStorage.setItem('Expiration', `${now + 1000 * 60 * 60 * 24 * 23}`);

      setAuthLoading(false);
      router.push('/browse');
    } catch (error: any) {
      setAuthLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <HeaderContainer>
        <Form>
          <Form.Title>Sign Up</Form.Title>
          {error && <Form.Error>{error}</Form.Error>}

          <Form.Base onSubmit={handleSignup} method="POST">
            <Form.Input
              placeholder="First name"
              value={firstName}
              onChange={({ target }) => {
                setFirstName(target.value);
                setError('');
              }}
            />
            <Form.Input
              placeholder="Email address"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
                setError('');
              }}
            />
            <Form.Input
              type="password"
              value={password}
              autoComplete="off"
              placeholder="Password"
              onChange={({ target }) => {
                setPassword(target.value);
                setError('');
              }}
            />

            <Form.Submit disabled={isInvalid} type="submit">
              {authLoading ? '. . .' : 'Sign Up'}
            </Form.Submit>
          </Form.Base>

          <Form.Text>
            Already a user?
            <NextLink href={'/signin'}>
              <Form.Link>Sign in now.</Form.Link>
            </NextLink>
          </Form.Text>
          <Form.TextSmall>This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.</Form.TextSmall>
        </Form>
      </HeaderContainer>
      <FooterContainer />
    </>
  );
};

export default Signup;
