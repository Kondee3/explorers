export interface FileObject {
  name: string;
  is_folder: boolean;
  file_type: string;
  size: string;
  path: string;
}
interface Props {
  file: FileObject;
  onClick: () => void;
  visibleAll: boolean;
}

const File = ({ file, onClick, visibleAll }: Props) => {
  return (
    <tr
      className="hover:backdrop-contrast-20 hover:z-0 hover:cursor-pointer border-none text-left "
      onClick={onClick}
    >
      <th className="whitespace-nowrap max-w-md truncate ">{file.name}</th>
      {visibleAll &&
        <th>{file.file_type}</th>} {visibleAll &&
        <th>{file.file_type != "Folder" ? file.size : ""}</th>}
    </tr>
  );
};

export default File;
