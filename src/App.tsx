import TextEditor from "./TextEditor";
import { FileObject } from "./File";
import File from "./File";
import FirstRowButton from "./FirstRowButton";
import "highlight.js/styles/hybrid.css";
import { useState } from "react";
import { invoke } from "@tauri-apps/api";
export interface FilesWithPath {
  file_vec: FileObject[];
  path_dir: string;
}
const App= () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [fileName, setFileName] = useState("");
  const [path, setPath] = useState("");
  const [doReverse, setDoReverse] = useState(true);
  const [content, setContent] = useState("");
  const [visibleAll, setVisibleAll] = useState(true);
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
  async function openFile(filePath: string): Promise<string> {
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
    openFile(file.path).then((s: string) => setContent(s));
    setVisibleAll(false);
  }

  return (
    <div onLoad={() => getFiles(path)} className="container flex flex-col ">
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

      <div
        className={!content ? "grid grid-cols-1" : "grid gap-2 grid-cols-2 "}
      >
        <div>
          <table className="mt-2 bg-backtable table-fixed rounded-md col-span-1">
            <thead>
              <tr>
                <FirstRowButton
                  children="Name"
                  styles="rounded-tl-md"
                  onClick={() => sortFiles("name")}
                />
                {visibleAll &&
                  (
                    <FirstRowButton
                      children="Type"
                      onClick={() => sortFiles("file_type")}
                    />
                  )}
                {visibleAll &&
                  (
                    <FirstRowButton
                      children="Size"
                      styles="rounded-tr-md"
                      onClick={() => sortFiles("size")}
                    />
                  )}
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
                    visibleAll={visibleAll}
                    key={id}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        {content && (
          <TextEditor content={content}>
          </TextEditor>
        )}
      </div>
    </div>
  );
};
export default App;
