import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  makeStyles,
  Card as MuiCard,
  CardHeader,
  CardContent
} from '@material-ui/core';
import {DragHandle} from '@material-ui/icons';
import {Resizable} from 're-resizable';
import {useMousePosition} from 'hooks';

const INITIAL_WIDTH = 400;
const INITIAL_HEIGHT = 300;

const INITIAL_X = 300;
const INITIAL_Y = 10;

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
  // width and height of resizable container
  const [resizableHeight, setResizableHeight] = useState(height);
  const [resizableWidth, setResizableWidth] = useState(width);

  // width and height of card
  const [cardHeight, setCardHeight] = useState(height);
  const [cardWidth, setCardWidth] = useState(width);

  // mouse position hook
  const position = useMousePosition();

  // card x and y
  const [resizableX, setResizableX] = useState(x);
  const [resizableY, setResizableY] = useState(y);

  // stuff for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    setResizableX(position.x - dragOffset.x);
    setResizableY(position.y - dragOffset.y);
  }, [isDragging, position, dragOffset]);

  // create styles using state values
  const classes = createStyles({
    height: cardHeight,
    width: cardWidth,
    x: resizableX,
    y: resizableY
  });

  // callback to resize container to lock in the size
  const resize = useCallback(
    delta => {
      setResizableHeight(curHeight => curHeight + delta.height);
      setResizableWidth(curWidth => curWidth + delta.width);
    },
    [setResizableWidth, setResizableHeight]
  );

  // callback to resize card so user has visual of how large the card is gonna be
  const resizeCard = useCallback(
    delta => {
      setCardHeight(height + delta.height);
      setCardWidth(width + delta.width);
    },
    [setCardWidth, setCardHeight, height, width]
  );

  // set dragging to true and calculate offset
  const startDrag = useCallback(() => {
    setIsDragging(true);

    if (containerRef.current === null) return;

    const clientRect = containerRef.current.getBoundingClientRect() as DOMRect;
    console.log(position, clientRect);

    setDragOffset({
      x: position.x - clientRect.x,
      y: position.y - clientRect.y
    });
  }, [position]);

  return (
    <div className={classes.resizableRoot} ref={containerRef}>
      <Resizable
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
        <MuiCard className={classes.rootCard}>
          <CardHeader
            action={
              <DragHandle
                onMouseDown={startDrag}
                onMouseUp={() => setIsDragging(false)}
              />
            }
            title='Header'
          />
          <CardContent>{children}</CardContent>
        </MuiCard>
      </Resizable>
    </div>
  );
};
