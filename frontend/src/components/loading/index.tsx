import React from 'react';
import { LockBody, ReleaseBody, Spinner, Picture } from './styles/loading';

interface Props {
  src?: string;
}

export default function Loading({ src, ...restProps }: Props) {
  return (
    <Spinner {...restProps}>
      <LockBody />
      <Picture src={src} />
    </Spinner>
  );
}

Loading.ReleaseBody = function LoadingReleaseBody() {
  return <ReleaseBody />;
};
