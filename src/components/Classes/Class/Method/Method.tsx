import React from 'react';
import { Container } from 'react-bootstrap';
import './Method.css';

export default function Method( ea, method ) {
  return (
    <>
      <td>
        { ea }
      </td>
      <td>
        { method.name }
      </td>
      <td>
        { method.type }
      </td>
    </>
  );
};
