import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import File from "./File";
import { FileObject } from "./File";
import FirstRowButton from "./FirstRowButton";
function App() {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [path, setPath] = useState("");
  const [doReverse, setDoReverse] = useState(true);
  async function getFiles() {
    setFiles(await invoke("get_files", { path }));
  }
  async function openFile(file: FileObject) {
    await invoke("open_file", { file });
  }
  async function sortFiles(columnName: string) {
    setFiles(await invoke("sort_files", { files, columnName, doReverse }));
    setDoReverse(!doReverse);
  }
  async function findFile() {
    setFiles(await invoke("find_file", { fileName, path }));
  }
  async function getUpperDir() {
    setFiles(await invoke("get_upper_dir", { path }));
    setPath(await invoke("get_upper_dir_path", { path }));
  }
  function openFileOrFolder(file: FileObject) {
    if (file.file_type == "Folder") {
      setPath(file.path);
      getFiles();
    } else openFile(file);
  }

  return (
    <div onLoad={getFiles} className="container flex flex-col ">
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
            getFiles();
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
              getFiles();
            }
          }}
        >
            <input
              onChange={(e) => setFileName(e.currentTarget.value)}
              placeholder="Enter a filename"
            >
            </input>
            <button>
              <img
                src="https://cdn-icons-png.flaticon.com/512/49/49116.png"
                className="contrast-0"
                width="30"
                height="30"
              />
            </button>
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
                No Files
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
