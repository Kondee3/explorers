import { FileObject } from "./File";
import File from "./File";
import FirstRow from "./FirstRow";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
export interface FilesWithPath {
  file_vec: FileObject[];
  path_dir: string;
}
const App = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [fileName, setFileName] = useState("");
  const [path, setPath] = useState("");
  const [doReverse, setDoReverse] = useState(true);
  async function getFiles(folderPath: string) {
    let res: FilesWithPath = await invoke("get_files", { folderPath });
    setFilesAndPath(res);
  }
  async function getUpperDir() {
    setFilesAndPath(await invoke("get_upper_dir", { path }));
  }

  function setFilesAndPath(res: FilesWithPath) {
    setFiles(res.file_vec!);
    setPath(res.path_dir!);
  }
  async function openFile(filePath: string) {
    return await invoke("open_file", { filePath });
  }

  async function sortFiles(columnName: string) {
    setFiles(await invoke("sort_files", { files, columnName, doReverse }));
    setDoReverse(!doReverse);
  }

  async function findFile() {
    let out: FileObject[] = await invoke("find_file", { fileName, path });
    setFiles(out);
  }

  function openFileOrFolder(file: FileObject) {
    if (file.file_type == "Folder") {
      getFiles(file.path);
      return;
    }
    openFile(file.path);
  }

  return (
    <div onLoad={() => getFiles(path)} className="container flex flex-col ">
      <div className="flex mt-2">
        <button onClick={getUpperDir}>
          <img
            src="https://static.thenounproject.com/png/4149528-200.png"
            className="contrast-0"
            width="30"
            height="30"
          />
        </button>
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault();
            getFiles(path);
          }}
        >
          <input
            onChange={(e) => setPath(e.currentTarget.value)}
            placeholder="Enter a path"
            value={path}
          />
        </form>
        <form
          className="flex absolute right-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (fileName != "") {
              findFile();
            } else {
              getFiles(path);
            }
          }}
        >
          <input
            onChange={(e) => {
              setFileName(e.currentTarget.value);
            }}
            placeholder="Enter a filename"
          ></input>
        </form>
      </div>

      <div>
        <table className="table-fixed gap-0 mt-2 col-span-1  w-11/12 border rounded-md  inline inline-1 inline-gray-500 overflow-hidden absolute left-1/2 transform -translate-x-1/2">
          <thead>
            <FirstRow sortFunction={sortFiles} />
          </thead>
          <tbody>
            {files.length == 0 && (
              <tr>
                <th>No Files</th>
              </tr>
            )}
            {files.map((f: FileObject, id: number) => {
              return (
                <File file={f} onClick={() => openFileOrFolder(f)} key={id} />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default App;
