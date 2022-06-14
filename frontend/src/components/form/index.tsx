import React, { ButtonHTMLAttributes } from 'react';
import { Container, Error, Base, Title, Text, TextSmall, Link, Input, Submit } from './styles/form';

interface Props {
  children?: React.ReactNode;
}

interface InputProps extends Props, React.InputHTMLAttributes<HTMLInputElement> {}

interface FormButtonProps extends Props, React.ButtonHTMLAttributes<HTMLButtonElement> {}

interface FormBaseProps extends Props, React.FormHTMLAttributes<HTMLFormElement> {}

export default function Form({ children, ...restProps }: Props) {
  return <Container {...restProps}>{children}</Container>;
}

Form.Error = function FormError({ children, ...restProps }: Props) {
  return <Error {...restProps}>{children}</Error>;
};

Form.Base = function FormBase({ children, ...restProps }: FormBaseProps) {
  return <Base {...restProps}>{children}</Base>;
};

Form.Title = function FormTitle({ children, ...restProps }: Props) {
  return <Title {...restProps}>{children}</Title>;
};

Form.Text = function FormText({ children, ...restProps }: Props) {
  return <Text {...restProps}>{children}</Text>;
};

Form.TextSmall = function FormTextSmall({ children, ...restProps }: Props) {
  return <TextSmall {...restProps}>{children}</TextSmall>;
};

Form.Link = React.forwardRef(function FormLink({ children, ...restProps }: Props, ref: React.ForwardedRef<HTMLAnchorElement>) {
  return (
    <Link {...restProps} ref={ref}>
      {children}
    </Link>
  );
});

Form.Input = function FormInput({ children, ...restProps }: InputProps) {
  return <Input {...restProps}>{children}</Input>;
};

Form.Submit = function FormSubmit({ children, ...restProps }: FormButtonProps) {
  return <Submit {...restProps}>{children}</Submit>;
};
