import React, { useState, useContext, createContext, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import NextImage from 'next/image';
import Configurations from '../../models/tmdbConfiguration';

import {
  Container,
  Group,
  Title,
  SubTitle,
  Text,
  Feature,
  FeatureTitle,
  FeatureText,
  FeatureClose,
  Maturity,
  Content,
  Meta,
  Item,
  Image,
  IsFavourite,
} from './styles/card';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface Props {
  children: React.ReactNode;
}

interface Images {
  src: string;
}

interface CardItemProps extends Props {
  item: ItemFeature;
}

interface CardFeatureProps extends Props {
  configuration: Record<'images', Configurations>;
}

interface ItemFeature {
  id: number;
  title: string;
  genre: string;
  maturity?: number;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
}

interface FeatureContext {
  showFeature: boolean;
  itemFeature: ItemFeature;
  setItemFeature: React.Dispatch<React.SetStateAction<ItemFeature>>;
  setShowFeature: React.Dispatch<React.SetStateAction<boolean>>;
}

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export const FeatureContext = createContext<FeatureContext>({
  showFeature: false,
  itemFeature: {
    id: 0,
    title: '',
    overview: '',
    poster_path: '',
    genre: '',
    release_date: '',
    backdrop_path: '',
  },
  setItemFeature: () => {},
  setShowFeature: () => {},
});

export const FeatureContextProvider = ({ children }: Props) => {
  const [showFeature, setShowFeature] = useState(false);
  const [itemFeature, setItemFeature] = useState({
    id: 0,
    title: '',
    overview: '',
    poster_path: '',
    genre: '',
    release_date: '',
    backdrop_path: '',
  });

  return (
    <FeatureContext.Provider value={{ showFeature, setShowFeature, itemFeature, setItemFeature }}>
      {children}
    </FeatureContext.Provider>
  );
};

export default function Card({ children, ...restProps }: Props) {
  return (
    <FeatureContextProvider>
      <Container {...restProps}>{children}</Container>
    </FeatureContextProvider>
  );
}

Card.Group = function CardGroup({ children, ...restProps }: Props) {
  return <Group {...restProps}>{children}</Group>;
};

Card.Title = function CardTitle({ children, ...restProps }: Props) {
  return <Title {...restProps}>{children}</Title>;
};

Card.SubTitle = function CardSubTitle({ children, ...restProps }: Props) {
  return <SubTitle {...restProps}>{children}</SubTitle>;
};

Card.IsFavourite = function CardIsFavourite({
  isFavourite = false,
  slug,
  contentId,
}: {
  isFavourite: boolean;
  slug: string;
  contentId: number;
}) {
  const [inWatchLater, setInWatchLater] = useState(isFavourite);
  useEffect(() => {
    setInWatchLater(isFavourite);
  }, [isFavourite]);
  const updateWatchListHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInWatchLater((prev) => !prev);
    const response = axios({
      method: 'PATCH',
      url: `content/${slug}/updateWatchlist/${contentId}`,
      baseURL: `${process.env.url}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    });
  };

  return (
    <IsFavourite onClick={updateWatchListHandler}>
      {inWatchLater ? <img src="/icons/heart_full.png" alt="added" /> : <img src="/icons/heart_empty.png" alt="NotAdded" />}
    </IsFavourite>
  );
};

Card.Text = function CardText({ children, ...restProps }: Props) {
  return <Text {...restProps}>{children}</Text>;
};

Card.Entities = function CardEntities({ children, ...restProps }: Props) {
  return (
    <Carousel
      swipeable={false}
      draggable={false}
      shouldResetAutoplay={false}
      transitionDuration={1000}
      responsive={responsive}
      renderButtonGroupOutside={true}
      {...restProps}
    >
      {children}
    </Carousel>
  );
};

Card.Meta = function CardMeta({ children, ...restProps }: Props) {
  return <Meta {...restProps}>{children}</Meta>;
};

Card.Item = function CardItem({ item, children, ...restProps }: CardItemProps) {
  const { setShowFeature, setItemFeature } = useContext(FeatureContext);

  return (
    <Item
      onClick={() => {
        setItemFeature(item);
        setShowFeature(true);
      }}
      {...restProps}
    >
      {children}
    </Item>
  );
};

Card.Image = function CardImage({ src, ...restProps }: Images) {
  return (
    <Image>
      <NextImage src={src} height={700} width={500} layout="responsive" objectFit="contain" {...restProps} />;
    </Image>
  );
};

Card.Feature = function CardFeature({ children, configuration, ...restProps }: CardFeatureProps) {
  const { showFeature, itemFeature, setShowFeature } = useContext(FeatureContext);

  return showFeature ? (
    <Feature {...restProps} src={`${configuration.images.base_url}w780${itemFeature.backdrop_path}`}>
      <Content>
        <FeatureTitle>{itemFeature.title}</FeatureTitle>
        <FeatureText>{itemFeature.overview}</FeatureText>
        <FeatureClose onClick={() => setShowFeature(false)}>
          <img src="/icons/close.png" alt="Close" />
        </FeatureClose>

        <Group margin="30px 0" flexDirection="row" alignItems="center">
          <Maturity rating={8}>{itemFeature.maturity ? 'PG' : itemFeature.maturity}</Maturity>
          <FeatureText fontWeight="bold">
            {itemFeature.genre ? itemFeature.genre.charAt(0).toUpperCase() + itemFeature.genre.slice(1) : ''}
          </FeatureText>
        </Group>

        {children}
      </Content>
    </Feature>
  ) : null;
};
