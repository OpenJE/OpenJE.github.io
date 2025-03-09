import React from 'react';
import { Container } from 'react-bootstrap';
import './VTable.css';

export default function Method( ea, vftable ) {
  return (
    <>
      <td>
        { ea },
      </td>
      <td>
        { vftable.length }
      </td>
    </>
  );
};
