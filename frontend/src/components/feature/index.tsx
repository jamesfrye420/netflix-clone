import React from 'react';
import { Container, Title, SubTitle } from './styles/feature';

interface Props {
  children: React.ReactNode;
}

export default function Feature({ children, ...restProps }: Props) {
  return <Container {...restProps}>{children}</Container>;
}

Feature.Title = function FeatureTitle({ children, ...restProps }: Props) {
  return <Title {...restProps}>{children}</Title>;
};

Feature.SubTitle = function FeatureSubTitle({ children, ...restProps }: Props) {
  return <SubTitle {...restProps}>{children}</SubTitle>;
};
