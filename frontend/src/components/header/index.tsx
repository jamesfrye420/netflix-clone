import React, { Children, useState } from 'react';
import NextLink from 'next/link';
import {
  Container,
  Group,
  Background,
  Dropdown,
  Picture,
  Link,
  Search,
  Profile,
  FeatureCallOut,
  SearchIcon,
  SearchInput,
  ButtonLink,
  PlayButton,
  Text,
  Feature,
  Logo,
} from './styles/header';

interface Props {
  children: React.ReactNode;
}

interface TextLink extends React.HTMLAttributes<HTMLParagraphElement> {
  active?: string;
}

interface Search {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

interface ImageSrc {
  src?: string;
}

interface HeaderProps extends Props, ImageSrc {
  bg?: boolean;
  dontShowOnSmallViewPort?: boolean;
}

interface LogoProps extends Props {
  to: string;
}

export default function Header({ bg = true, children, src, dontShowOnSmallViewPort, ...restProps }: HeaderProps) {
  return bg ? (
    <Background src={src as string} dontShowOnSmallViewPort={dontShowOnSmallViewPort as boolean} {...restProps}>
      {children}
    </Background>
  ) : (
    <>{children}</>
  );
}

Header.Frame = function HeaderFrame({ children, ...restProps }: Props) {
  return <Container {...restProps}>{children}</Container>;
};

Header.Group = function HeaderGroup({ children, ...restProps }: Props) {
  return <Group {...restProps}>{children}</Group>;
};

Header.Logo = React.forwardRef(function HeaderLogo(
  { to, children, ...restProps }: LogoProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <NextLink href={to} passHref ref={ref}>
      <Logo {...restProps}>{children}</Logo>
    </NextLink>
  );
});

Header.Search = function HeaderSearch({ searchTerm, setSearchTerm, ...restProps }: Search) {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <Search {...restProps}>
      <SearchIcon onClick={() => setSearchActive((searchActive) => !searchActive)}>
        <img src="/icons/search.png" alt="Search" />
      </SearchIcon>
      <SearchInput
        value={searchTerm}
        onChange={({ target }) => setSearchTerm(target.value)}
        placeholder="Search films and series"
        active={searchActive}
      />
    </Search>
  );
};

Header.Profile = function HeaderProfile({ children, ...restProps }: Props) {
  return <Profile {...restProps}>{children}</Profile>;
};

Header.Feature = function HeaderFeature({ children, ...restProps }: Props) {
  return <Feature>{children}</Feature>;
};

Header.Picture = function HeaderPicture({ src, ...restProps }: ImageSrc) {
  return <Picture {...restProps} src={src as string} />;
};

Header.Dropdown = function HeaderDropdown({ children, ...restProps }: Props) {
  return <Dropdown {...restProps}>{children}</Dropdown>;
};

Header.TextLink = function HeaderTextLink({ children, active, ...restProps }: TextLink) {
  return (
    <Link active={active as string} {...restProps}>
      {children}
    </Link>
  );
};

Header.PlayButton = function HeaderPlayButton({ children, ...restProps }: Props) {
  return <PlayButton {...restProps}>{children}</PlayButton>;
};

Header.FeatureCallOut = function HeaderFeatureCallOut({ children, ...restProps }: Props) {
  return <FeatureCallOut {...restProps}>{children}</FeatureCallOut>;
};

Header.Text = function HeaderText({ children, ...restProps }: Props) {
  return <Text {...restProps}>{children}</Text>;
};

Header.ButtonLink = React.forwardRef(function HeaderButtonLink(
  { children, ...restProps }: Props,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <ButtonLink {...restProps} ref={ref}>
      {children}
    </ButtonLink>
  );
});
