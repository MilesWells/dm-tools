import React, {useState, useCallback} from 'react';
import {makeStyles, Card as MuiCard} from '@material-ui/core';
import {Resizable} from 're-resizable';

const INITIAL_WIDTH = 400;
const INITIAL_HEIGHT = 300;

interface CustomCardProps {
  height?: string | number;
  width?: string | number;
}

type CardProps = React.PropsWithChildren<CustomCardProps>;
const createStyles = makeStyles<any, Partial<CardProps>>({
  rootCard: {
    height: ({height}) => height,
    margin: 'unset',
    padding: 10,
    width: ({width}) => width
  }
});

export const Card: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  const [height, setHeight] = useState(INITIAL_HEIGHT);
  const [width, setWidth] = useState(INITIAL_WIDTH);

  const [cardHeight, setCardHeight] = useState(INITIAL_HEIGHT);
  const [cardWidth, setCardWidth] = useState(INITIAL_WIDTH);

  const classes = createStyles({height: cardHeight, width: cardWidth});

  const resize = useCallback(
    (delta: {height: number; width: number}) => {
      setHeight(curHeight => curHeight + delta.height);
      setWidth(curWidth => curWidth + delta.width);
    },
    [setWidth, setHeight]
  );

  const resizeCard = useCallback(
    (delta: {height: number; width: number}) => {
      setCardHeight(() => height + delta.height);
      setCardWidth(() => width + delta.width);
    },
    [setCardWidth, setCardHeight, height, width]
  );

  return (
    <Resizable
      bounds='parent'
      minWidth={100}
      minHeight={100}
      size={{
        height,
        width
      }}
      onResize={(_, __, ___, delta) => resizeCard(delta)}
      onResizeStop={(_, __, ___, delta) => resize(delta)}
    >
      <MuiCard className={classes.rootCard}>{children}</MuiCard>
    </Resizable>
  );
};
