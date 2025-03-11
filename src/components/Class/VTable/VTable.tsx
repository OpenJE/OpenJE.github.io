import { Method } from '../Method/Method';
import { Container } from 'react-bootstrap';
import './VTable.css';

export type VTable = {
  ea: string,
  entries: Map<string, Method>,
  length: number,
  vftptr: string
}

export default function VTableData( ea: string, vftable: VTable ) {
  return (
    <Container className="vtable-container">
      <td>
        { ea }
      </td>
      <td>
        { vftable.length }
      </td>
    </Container>
  );
};
