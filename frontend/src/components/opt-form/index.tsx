import React from 'react';
import { Container, Input, Break, Button, Text } from './styles/opt-form';

interface Props {
  children?: React.ReactNode;
}

export default function OptForm({ children, ...restProps }: React.FormHTMLAttributes<HTMLFormElement>) {
  return <Container {...restProps}>{children}</Container>;
}

OptForm.Input = function OptFormInput({ ...restProps }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...restProps} />;
};

OptForm.Button = function OptFormButton({ children, ...restProps }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button {...restProps}>
      {children} <img src="/icons/chevron-right.png" alt="Try Now" />
    </Button>
  );
};

OptForm.Text = function OptFormText({ children, ...restProps }: Props) {
  return <Text {...restProps}>{children}</Text>;
};

OptForm.Break = function OptFormBreak({ ...restProps }: Props) {
  return <Break {...restProps} />;
};
