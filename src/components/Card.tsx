import React, {useState, useCallback} from 'react';
import {makeStyles, Card as MuiCard} from '@material-ui/core';
import {Resizable} from 're-resizable';

const INITIAL_WIDTH = 400;
const INITIAL_HEIGHT = 300;

const INITIAL_X = 0;
const INITIAL_Y = 0;

interface CustomCardProps {
  height?: string | number;
  width?: string | number;
  x?: number;
  y?: number;
}

export type CardProps = React.PropsWithChildren<CustomCardProps>;

const createStyles = makeStyles<any, Partial<CardProps>>({
  rootCard: {
    height: '100%',
    margin: 'unset',
    padding: 10,
    width: '100%'
  },
  resizableRoot: {
    height: ({height}) => height,
    position: 'absolute',
    top: ({y}) => y,
    left: ({x}) => x,
    width: ({width}) => width
  }
});

export const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  height = INITIAL_HEIGHT,
  width = INITIAL_WIDTH,
  x = INITIAL_X,
  y = INITIAL_Y
}) => {
  const [resizableHeight, setResizableHeight] = useState(height);
  const [resizableWidth, setResizableWidth] = useState(width);

  const [cardHeight, setCardHeight] = useState(height);
  const [cardWidth, setCardWidth] = useState(width);

  const [cardX, setCardX] = useState(x);
  const [cardY, setCardY] = useState(y);

  const classes = createStyles({
    height: cardHeight,
    width: cardWidth,
    x: cardX,
    y: cardY
  });

  const resize = useCallback(
    delta => {
      setResizableHeight(curHeight => curHeight + delta.height);
      setResizableWidth(curWidth => curWidth + delta.width);
    },
    [setResizableWidth, setResizableHeight]
  );

  const resizeCard = useCallback(
    delta => {
      setCardHeight(height + delta.height);
      setCardWidth(width + delta.width);
    },
    [setCardWidth, setCardHeight, height, width]
  );

  return (
    <Resizable
      className={classes.resizableRoot}
      bounds='parent'
      minWidth={100}
      minHeight={100}
      size={{
        height: resizableHeight,
        width: resizableWidth
      }}
      onResize={(_, __, ___, delta) => resizeCard(delta)}
      onResizeStop={(_, __, ___, delta) => resize(delta)}
    >
      <MuiCard className={classes.rootCard}>{children}</MuiCard>
    </Resizable>
  );
};
