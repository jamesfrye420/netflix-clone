import React from 'react';
import { Container, Title, List, Item, Picture, Name } from './styles/profiles';

interface Props {
  children: React.ReactNode;
}

interface src {
  src: string;
}

export default function Profiles({ children, ...restProps }: Props) {
  return <Container {...restProps}>{children}</Container>;
}

Profiles.Title = function ProfilesTitle({ children, ...restProps }: Props) {
  return <Title {...restProps}>{children}</Title>;
};

Profiles.List = function ProfilesList({ children, ...restProps }: Props) {
  return <List {...restProps}>{children}</List>;
};

Profiles.User = function ProfilesUser({ children, ...restProps }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <Item {...restProps}>{children}</Item>;
};

Profiles.Picture = function ProfilesPicture({ src, ...restProps }: src) {
  return <Picture {...restProps} src={src ? src : `${process.env.url}/images/misc/loading.gif`} />;
};

Profiles.Name = function ProfilesName({ children, ...restProps }: Props) {
  return <Name {...restProps}>{children}</Name>;
};
