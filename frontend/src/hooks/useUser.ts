import { useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import useSWR from 'swr';
import Cookies from 'js-cookie';
import User from '../models/user';

interface VerifyUserResponse {
  message: string;
  userId: string;
  User: User;
}

const fetcher = async (url: string, token: string) => {
  const response = await axios.get<VerifyUserResponse>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status !== 200) {
    throw new Error('could not validate');
  }
  return response.data;
};

export default function useUser({ redirectTo = '', redirectIfFound = false } = {}) {
  const token = Cookies.get('token');
  const {
    data: User,
    mutate: mutateUser,
    isValidating,
  } = useSWR(() => (token ? [`${process.env.url}/auth/user`, token] : null), fetcher);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || isValidating) return;

    if (
      // If redirectTo is set, redirect if the User was not found.
      (redirectTo && redirectIfFound === false && !User) ||
      // If redirectIfFound is also set, redirect if the User was found
      (redirectIfFound && User)
    ) {
      Router.replace(redirectTo);
    }
  }, [User, redirectIfFound, redirectTo]);

  return { User, mutateUser, isValidating };
}
