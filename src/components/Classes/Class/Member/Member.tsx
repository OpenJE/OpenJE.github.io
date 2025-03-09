import React from 'react';
import { Container } from 'react-bootstrap';
import './Member.css';

export default function Member( offset, member ) {
  return (
    <>
      <td>
        { offset }
      </td>
      <td>
        { member.name }
      </td>
      <td>
        { member.type }
      </td>
    </>
  );
};
