import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Router, { useRouter } from 'next/router';
import { HeaderContainer } from '../src/containers/header';
import { FooterContainer } from '../src/containers/footer';

interface Props {
  children: React.ReactNode;
}

interface UserCtx {
  userId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  setRedirectTo: React.Dispatch<React.SetStateAction<string>>;
  setRedirectIfFound: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => void;
  logout: () => void;
}

interface VerifyUserResponse {
  message: string;
  userId: string;
}

interface SigninResponse {
  message: string;
  data?: {
    param: string;
    value: any;
    msg: any;
  };
  token: string;
  userId: string;
}

const AuthContext = React.createContext<UserCtx>({
  userId: '',
  isAuthenticated: false,
  setRedirectTo: () => {},
  setRedirectIfFound: () => {},
  isLoading: true,
  error: '',
  login: (email, password) => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const [redirectIfFound, setRedirectIfFound] = useState(false);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token');
      if (token) {
        const response = await axios.get<VerifyUserResponse>(`${process.env.url}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUserId(response.data.userId);
        }
      }
      setLoading(false);
    }
    loadUserFromCookies();
    if (!redirectTo) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !userId) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && userId)
    ) {
      Router.push(redirectTo);
    }
  }, [userId, redirectIfFound, redirectTo]);

  const isAuthenticated = !!userId;

  const loginHandler = async (email: string, password: string) => {
    const url = `${process.env.url}/auth/signin`;
    try {
      const response = await axios.post<SigninResponse>(
        url,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status !== 200) {
        setLoading(false);
        throw new Error('Could not authenticate you!');
      }
      if (response.data.token && response.data.userId) {
        Cookies.set('token', response.data.token, { expires: 60 });
        setUserId(response.data.userId);
      }
    } catch (Error: any) {
      setLoading(false);
      setError(Error.response.data.message);
    }
  };

  const logoutHandler = () => {
    Cookies.remove('token');
    setUserId('');
    window.location.pathname = '/signin';
  };

  const contextValue: UserCtx = {
    userId,
    setRedirectIfFound,
    setRedirectTo,
    isAuthenticated,
    login: loginHandler,
    logout: logoutHandler,
    isLoading: loading,
    error,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;

// export const ProtectRoute = ({ children }: Props) => {
//   const { isAuthenticated, isLoading } = useContext(AuthContext);
//   if (isLoading || (!isAuthenticated && !(window.location.pathname in ['/signin', '/signup', '/']))) {
//     return (
//       <>
//         <HeaderContainer>
//           <p>Loading...</p>
//         </HeaderContainer>
//         <FooterContainer />
//       </>
//     );
//   }
//   return <>{children}</>;
// };
