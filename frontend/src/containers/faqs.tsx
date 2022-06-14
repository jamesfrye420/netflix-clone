import React from 'react';
import { useRouter } from 'next/router';
import { Accordion, OptForm } from '../components';

import FaqsData from '../models/faqs';

interface Props {
  faqsData: FaqsData[];
}

export const FaqsContainer = ({ faqsData }: Props) => {
  const router = useRouter();
  const submitHandler = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/signup');
  };
  return (
    <Accordion>
      <Accordion.Title>Frequently Asked Questions</Accordion.Title>
      <Accordion.Frame>
        {faqsData.map((item) => (
          <Accordion.Item key={item._id}>
            <Accordion.Header>{item.header}</Accordion.Header>
            <Accordion.Body>{item.body}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion.Frame>

      <OptForm onSubmit={submitHandler}>
        <OptForm.Input name="email" type="email" placeholder="Email address" />
        <OptForm.Button type="submit">Try it now</OptForm.Button>
        <OptForm.Break />
        <OptForm.Text>Ready to watch? Enter your email to create or restart your membership.</OptForm.Text>
      </OptForm>
    </Accordion>
  );
};
