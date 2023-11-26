export interface FileObject {
  name: string;
  file_type: string;
  size: string;
  path: string;
}
interface Props {
  file: FileObject;
    onClick: () => void;
}

const File = ({ file, onClick }: Props) => {
  return (
    <tr className="otherRowButton" onClick={onClick}>
      <th>{file.name}</th>
      <th>{file.file_type}</th>
      <th>{file.size}</th>
    </tr>
  );
};

export default File;
