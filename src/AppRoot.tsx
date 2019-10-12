import React from 'react';
import {Card} from 'components';

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
      <Card>Stuff but resizable this time</Card>
    </div>
  );
}
