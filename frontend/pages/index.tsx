import axios from 'axios';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

import { HeaderContainer } from '../src/containers/header';
import { FooterContainer } from '../src/containers/footer';
import { JumbotronContainer } from '../src/containers/Jumbotron';
import { FaqsContainer } from '../src/containers/faqs';

import { Feature, OptForm } from '../src/components';

import JumboData from '../src/models/Jumbotron';
import FaqsData from '../src/models/faqs';
import EmailContext from '../store/email-context';
import { useUser } from '../src/hooks';

interface Props {
  jumbotronData: JumboData[];
  faqsData: FaqsData[];
}

const uri = process.env.url;

const Home: NextPage<Props> = ({ jumbotronData, faqsData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const emailCtx = useContext(EmailContext);

  const { isValidating } = useUser({
    redirectTo: '/browse/movies',
    redirectIfFound: true,
  });

  // remapping the jumbotron data to append the domain name url before the image link

  const jumbodata = jumbotronData.map((item) => {
    return { ...item, image: `${uri}${item.image}` };
  });

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    router.push('/signup');
  };

  // change the loading state library

  return (
    <>
      <HeaderContainer>
        <Feature>
          <Feature.Title>Unlimited films, TV programmes and more.</Feature.Title>
          <Feature.SubTitle>Watch anywhere. Cancel anytime.</Feature.SubTitle>
          <OptForm onSubmit={submitHandler}>
            <OptForm.Input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={({ target }) => emailCtx.setEmail(target.value)}
            />
            <OptForm.Button type="submit">Try it now</OptForm.Button>
            <OptForm.Break />
            <OptForm.Text>Ready to watch? Enter your email to create or restart your membership.</OptForm.Text>
          </OptForm>
        </Feature>
      </HeaderContainer>
      <JumbotronContainer jumbotronData={jumbodata} />
      <FaqsContainer faqsData={faqsData} />
      <FooterContainer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  // getting data for jumbotron and returning an array of jumbotron data
  // Any error returns notfound true which trigger the 404 page
  try {
    const fetchedData = await axios.get<Props>(`${uri}/authPage/`);

    if (!fetchedData.data) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        jumbotronData: fetchedData.data.jumbotronData,
        faqsData: fetchedData.data.faqsData,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
export default Home;
