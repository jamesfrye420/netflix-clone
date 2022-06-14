import React from 'react';

import { Jumbotron } from '../components';
import JumboData from '../models/Jumbotron';

interface Props {
  jumbotronData: JumboData[];
}

export const JumbotronContainer = ({ jumbotronData }: Props) => {
  return (
    <Jumbotron.Container>
      {jumbotronData.map((item) => {
        return (
          <Jumbotron key={item._id} direction={item.direction}>
            <Jumbotron.Pane>
              <Jumbotron.Title>{item.title}</Jumbotron.Title>
              <Jumbotron.SubTitle>{item.subTitle}</Jumbotron.SubTitle>
            </Jumbotron.Pane>
            <Jumbotron.Pane>
              <Jumbotron.Image src={item.image} alt={item.alt} />
            </Jumbotron.Pane>
          </Jumbotron>
        );
      })}
    </Jumbotron.Container>
  );
};
