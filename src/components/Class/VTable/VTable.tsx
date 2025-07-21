import { Method } from '../Method/Method';
import VirtualMethodData from './VirtualMethod/VirtualMethod';
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
      <td>
        <table className="vtable-methods-table">
          <thead>
            <tr>
              <th>Offset</th>
              <th>Name</th>
              <th>Type</th>
              <th>Import</th>
            </tr>
          </thead>
          <tbody>
            { Object.entries( vftable.entries ).map( ( [ ea, method ] ) => (
              <tr key={ ea }>
                { VirtualMethodData( ea, method ) }
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </>
  );
};
