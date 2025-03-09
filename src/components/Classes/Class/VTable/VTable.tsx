import { Method } from '../Method/Method';
import './VTable.css';

export type VTable = {
  ea: string,
  entries: Map<string, Method>,
  length: number,
  vftptr: string
}

export default function VTableData( ea: string, vftable: VTable ) {
  return (
    <>
      <td>
        { ea }
      </td>
      <td>
        { vftable.length }
      </td>
    </>
  );
};
