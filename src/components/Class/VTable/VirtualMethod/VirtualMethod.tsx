import './VirtualMethod.css';
import { Method } from '../../Method/Method';

export default function VirtualMethodData( ea: string, method: Method ) {
  return (
    <>
      <td>
        { `0x${(Number( ea ) * 4).toString(16).toUpperCase()}` }
      </td>
      <td>
        { method.name }
      </td>
      <td>
        { method.type }
      </td>
      <td>
        { method.import ? 'Yes' : 'No' }
      </td>
    </>
  );
};
