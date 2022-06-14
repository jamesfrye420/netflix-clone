import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Header } from '../components';
import logo from '../logo.svg';

interface Props {
  children?: React.ReactNode;
}

export const HeaderContainer = ({ children }: Props) => {
  return (
    <Header>
      <Header.Frame>
        <Link href={'/'}>
          <Header.Logo to="/">
            <Image src={logo} alt="Netflix" width={100} height={50} layout="intrinsic" />
          </Header.Logo>
        </Link>
        <Link href="/signin" passHref>
          <Header.ButtonLink>Sign In</Header.ButtonLink>
        </Link>
      </Header.Frame>
      {children}
    </Header>
  );
};
