import React from 'react';
import Image from 'next/image';

import { Header, Profiles } from '../components';
import logo from '../logo.svg';

import User from '../models/user';

interface Props {
  user: User;
  setProfile: React.Dispatch<
    React.SetStateAction<{
      displayName: string;
      photoURL: string;
    }>
  >;
}

export function SelectProfileContainer({ user, setProfile }: Props) {
  return (
    <>
      <Header bg={false}>
        <Header.Frame>
          <Header.Logo to="/">
            <Image src={logo} alt="Netflix" width={100} height={50} layout="intrinsic" />
          </Header.Logo>
        </Header.Frame>
      </Header>

      <Profiles>
        <Profiles.Title>Who's watching?</Profiles.Title>
        <Profiles.List>
          <Profiles.User onClick={() => setProfile({ displayName: user.firstName, photoURL: user.photoURL })}>
            <Profiles.Picture src={user.photoURL} />
            <Profiles.Name>{user.firstName}</Profiles.Name>
          </Profiles.User>
        </Profiles.List>
      </Profiles>
    </>
  );
}
