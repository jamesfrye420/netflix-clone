import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';

import logo from '../../src/logo.svg';

import { useUser } from '../../src/hooks';

import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { SelectProfileContainer } from '../../src/containers/profiles';
import User from '../../src/models/user';
import Loading from '../../src/components/loading';
import { Card, Header, Player } from '../../src/components';
import Cookies from 'js-cookie';
import { FooterContainer } from '../../src/containers/footer';
import { FeatureContext, FeatureContextProvider } from '../../src/components/card';
import Configurations from '../../src/models/tmdbConfiguration';

interface Params extends ParsedUrlQuery {
  slug: string;
}

interface Configuration {
  images: Configurations;
}

interface MoviesSchema {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
  genres: string[];
}

interface Props {
  content: Record<string, MoviesSchema[]>;
  configuration: Configuration;
}

interface ResponseSchemaContent extends Props {
  message: string;
}

interface ResponseSchemaConfig {
  configuration: Configuration;
}

const random_number = Math.floor(Math.random() * 19 + 0);

const Browse: NextPage<Props> = ({ content, configuration }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  const { slug } = router.query;

  const [profile, setProfile] = useState({ displayName: '', photoURL: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const { setShowFeature } = useContext(FeatureContext);

  const { User: fetchedData, isValidating } = useUser({
    redirectTo: '/signin',
  });

  // check for the expiration time left and runs a setTime out at the specific interval
  useEffect(() => {
    const expirationDuration = localStorage.getItem('Expiration');
    let timeoutId: NodeJS.Timeout;

    const currentTime = new Date().getTime();
    if (!expirationDuration || currentTime > +expirationDuration) {
      Cookies.remove('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('Expiration');
      router.replace('/signin');
    } else {
      const interval = +expirationDuration - currentTime;
      const timer = () =>
        setTimeout(() => {
          Cookies.remove('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('Expiration');
          router.replace('/signin');
        }, interval);

      timeoutId = timer();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // check if the value has been tampered with, if true then sign out the user
  useEffect(() => {
    const handleValidationToken = (e: any) => {
      if ((e.key === 'userId' && e.oldValue && !e.newValue) || !(e.key === 'userId')) {
        Cookies.remove('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('Expiration');
        router.replace('/signin');
      }
    };
    window.addEventListener('storage', handleValidationToken);
    return () => {
      window.removeEventListener('storage', handleValidationToken);
    };
  }, []);

  const User = fetchedData?.User as User;

  return profile.displayName ? (
    <>
      {isValidating ? <Loading src={`${process.env.url}/${User.photoURL}`} /> : <Loading.ReleaseBody />}
      <Header
        src={`${configuration.images.base_url}original${content.TopRated[random_number].backdrop_path}`}
        dontShowOnSmallViewPort={true}
      >
        <Header.Frame>
          <Header.Group>
            <Header.Logo to="/">
              <Image src={logo} alt="Netflix" width={100} height={50} layout="intrinsic" />
            </Header.Logo>
            <FeatureContextProvider>
              <Header.TextLink
                active={slug === 'series' ? 'true' : 'false'}
                onClick={() => {
                  router.push('/browse/series');
                  setShowFeature(false);
                }}
              >
                Series
              </Header.TextLink>
              <Header.TextLink
                active={slug === 'movies' ? 'true' : 'false'}
                onClick={() => {
                  router.push('/browse/movies');
                  setShowFeature(false);
                }}
              >
                Films
              </Header.TextLink>
            </FeatureContextProvider>
          </Header.Group>
          <Header.Group>
            <Header.Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Header.Profile>
              <Header.Picture src={`${process.env.url}/${User.photoURL}`} />
              <Header.Dropdown>
                <Header.Group>
                  <Header.Picture src={`${process.env.url}/${User.photoURL}`} />
                  <Header.TextLink>{User.firstName}</Header.TextLink>
                </Header.Group>
                <Header.Group>
                  <Header.TextLink
                    onClick={() => {
                      Cookies.remove('token');
                      localStorage.removeItem('userId');
                      localStorage.removeItem('Expiration');
                      router.replace('/signin');
                    }}
                  >
                    Sign Out
                  </Header.TextLink>
                </Header.Group>
              </Header.Dropdown>
            </Header.Profile>
          </Header.Group>
        </Header.Frame>
        <Header.Feature>
          <Header.FeatureCallOut>{`Watch ${content.TopRated[random_number].title} Now`}</Header.FeatureCallOut>
          <Header.Text>{`${content.TopRated[random_number].overview}`}</Header.Text>
          <Player>
            <Player.Button />
            <Player.Video src="/videos/Family_Guy.mp4" />
          </Player>
        </Header.Feature>
      </Header>

      <Card.Group>
        {Object.keys(content).map((Items) => (
          <Card key={`${Items}`}>
            <Card.Title>{Items}</Card.Title>
            <Card.Entities>
              {content[Items].map((item) => (
                <Card.Item key={item.id} item={{ ...item, genre: item.genres[0] }}>
                  <Card.Image src={`${configuration.images.base_url}w500${item.poster_path}`} />
                  <Card.Meta>
                    <Card.IsFavourite
                      isFavourite={
                        slug === 'movies' ? User.watchLater.movies.includes(item.id) : User.watchLater.series.includes(item.id)
                      }
                      slug={slug as string}
                      contentId={item.id}
                    />
                    <Card.SubTitle>{item.title}</Card.SubTitle>
                    <Card.Text>{item.overview}</Card.Text>
                  </Card.Meta>
                </Card.Item>
              ))}
            </Card.Entities>
            <Card.Feature configuration={configuration}>
              <Player>
                <Player.Button />
                <Player.Video src="/videos/Family_Guy.mp4" />
              </Player>
            </Card.Feature>
          </Card>
        ))}
      </Card.Group>
      <FooterContainer />
    </>
  ) : (
    <>({User && <SelectProfileContainer user={User} setProfile={setProfile} />})</>
  );
};

export default Browse;

export const getStaticPaths: GetStaticPaths = () => {
  const slugs = ['movies', 'series'];
  const paths = slugs.map((slug) => {
    return {
      params: {
        slug,
      },
    };
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  try {
    const { data: browseData } = await axios.get<ResponseSchemaContent>(`${process.env.url}/content/${params?.slug}`);
    const { data: configData } = await axios.get<ResponseSchemaConfig>(`${process.env.url}/content/configuration`);

    return {
      props: {
        content: browseData.content,
        configuration: configData.configuration,
      },
      revalidate: 10800,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
