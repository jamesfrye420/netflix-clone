import React from 'react';
import NextLink from 'next/link';
import { Container, Row, Column, Link, Title, Text, Break } from './styles/footer';

interface Props {
  children?: React.ReactNode;
}

interface linkProps extends Props {
  href: string;
}

export default function Footer({ children, ...restProps }: Props) {
  return <Container {...restProps}>{children}</Container>;
}

Footer.Row = function FooterRow({ children, ...restProps }: Props) {
  return <Row {...restProps}>{children}</Row>;
};

Footer.Column = function FooterColumn({ children, ...restProps }: Props) {
  return <Column {...restProps}>{children}</Column>;
};

Footer.Link = function FooterLink({ children, href, ...restProps }: linkProps) {
  return (
    <NextLink href={href}>
      <Link {...restProps}>{children}</Link>
    </NextLink>
  );
};

Footer.Title = function FooterTitle({ children, ...restProps }: Props) {
  return <Title {...restProps}>{children}</Title>;
};

Footer.Text = function FooterText({ children, ...restProps }: Props) {
  return <Text {...restProps}>{children}</Text>;
};

Footer.Break = function FooterBreak({ ...restProps }) {
  return <Break {...restProps} />;
};
