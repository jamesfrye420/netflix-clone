import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

interface EmailCtx {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
const EmailContext = React.createContext<EmailCtx>({
  email: '',
  setEmail: () => {},
});

export const EmailContextProvider = ({ children }: Props) => {
  const [email, setEmail] = useState('');
  const contextValue = {
    email,
    setEmail,
  };
  return <EmailContext.Provider value={contextValue}>{children}</EmailContext.Provider>;
};

export default EmailContext;
