import './Method.css';

export type Method = {
  demangled_name: string,
  ea: string,
  import: boolean,
  name: string,
  type: string
}

export default function MethodData( ea: string, method: Method ) {
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
      <td>
        { method.import ? 'Yes' : 'No' }
      </td>
    </>
  );
};
