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
}

const File = ({ file, onClick }: Props) => {
  return (
    <tr
      className="hover:bg-gray-500  hover:cursor-pointer text-left "
      onClick={onClick}
    >
      <th className="whitespace-nowrap max-w-md truncate ">{file.name}</th>
      <th>{file.file_type}</th>
      <th>{file.file_type != "Folder" ? file.size : ""}</th>
    </tr>
  );
};

export default File;
