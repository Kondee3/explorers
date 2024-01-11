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

const File = ({ file, onClick}: Props) => {
  return (
    <tr className="hover:backdrop-contrast-20 hover:cursor-pointer border-none text-left " onClick={onClick}>
      <th className="whitespace-nowrap max-w-md truncate ">{file.name}</th>
      <th>{file.file_type}</th>
      <th>{file.file_type != "Folder" ? file.size : ""}</th>
    </tr>
  );
};

export default File;
