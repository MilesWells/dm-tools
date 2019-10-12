import React from 'react';
import {ResizableCard} from 'components';

export default function AppRoot() {
  return (
    <div
      style={{
        margin: '0 auto',
        width: 1024,
        height: 768,
        border: 'black solid'
      }}
    >
      <ResizableCard>Stuff but resizable this time</ResizableCard>
    </div>
  );
}
