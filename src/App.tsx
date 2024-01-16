import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import File from "./File";
import { FileObject } from "./File";
import FirstRowButton from "./FirstRowButton";

interface FilesWithPath {
  file_vec: FileObject[];
  path_dir: string;
}
function App() {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [fileName, setFileName] = useState("");
  const [path, setPath] = useState("");
  const [doReverse, setDoReverse] = useState(true);

  async function getFiles(folderPath: string) {
    let res: FilesWithPath = await invoke("get_files", { folderPath });
    console.log(res);
    setFilesAndPath(res);
  }

  async function getUpperDir() {
    setFilesAndPath(await invoke("get_upper_dir", { path }));
  }

  function setFilesAndPath(res: FilesWithPath) {
    setFiles(res.file_vec);
    setPath(res.path_dir);
  }
  async function openFile(filePath: string): Promise<string> {
    return await invoke("open_file", { filePath });
  }

  async function sortFiles(columnName: string) {
    setFiles(await invoke("sort_files", { files, columnName, doReverse }));
    setDoReverse(!doReverse);
  }

  async function findFile() {
    let out: FileObject[] = await invoke("find_file", { fileName, path });
    console.log(out);
    setFiles(out);
  }

  function openFileOrFolder(file: FileObject) {
    if (file.file_type == "Folder") {
      getFiles(file.path);
            
    } else openFile(file.path).then((s: string) => console.log(s));
  }

  return (
    <div onLoad={() => getFiles("")} className="container flex flex-col ">
      <div className="flex ">
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
          >
          </input>
        </form>
      </div>
      <table className="mt-2 bg-backtable table-fixed rounded-md ">
        <thead>
          <tr>
            <FirstRowButton
              styles="rounded-tl-md"
              onClick={() => sortFiles("name")}
            >
              Name
            </FirstRowButton>
            <FirstRowButton onClick={() => sortFiles("file_type")}>
              Type
            </FirstRowButton>
            <FirstRowButton
              styles="rounded-tr-md"
              onClick={() => sortFiles("size")}
            >
              Size
            </FirstRowButton>
          </tr>
        </thead>
        <tbody>
          {files.length == 0 &&
            (
              <tr>
                <th>
                  No Files
                </th>
              </tr>
            )}
          {files.map((f: FileObject, id: number) => {
            return (
              <File
                file={f}
                onClick={() => openFileOrFolder(f)}
                key={id}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
