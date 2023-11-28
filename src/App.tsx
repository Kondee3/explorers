import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import File from "./File";
import { FileObject } from "./File";
import FirstRowButton from "./FirstRowButton";
/*
import { onEventShowMenu } from "tauri-plugin-context-menu";
onEventShowMenu("contextmenu", () => ({
  items: [
    {
      label: "New",
      subitems: [
        {
          label: "Folder",
          event: "createFolderEvent",
        },
      ],
    },
  ],
}));
*/
function App() {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [path, setPath] = useState("");
  const [doReverse, setDoReverse] = useState(true);
  async function getFiles() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setFiles(await invoke("get_files", { path }));
  }
  async function openFile(file: FileObject) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke("open_file", { file });
  }
  async function sortFiles(columnName: string) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setFiles(await invoke("sort_files", { files, columnName, doReverse }));
    setDoReverse(!doReverse);
  }
  async function findFile() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setFiles(await invoke("find_file", { fileName, path }));
  }

  return (
    <div className="container flex flex-col">
      <div className="row flex">
        <button>
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
            placeholder="Enter a filename..."
          />
        </form>
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault();
            findFile();
          }}
        >
          <input
            onChange={(e) => setFileName(e.currentTarget.value)}
            placeholder="Enter a filename..."
          />
        </form>
        <button>
          <img
            src="https://cdn-icons-png.flaticon.com/512/49/49116.png"
            className="contrast-0"
            width="30"
            height="30"
          />
        </button>
      </div>
      <table className="mt-2 bg-backtable rounded-md table-auto">
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
          {files.map((f: FileObject, id: number) => {
            return (
              <File
                file={f}
                onClick={() => {
                  if (f.file_type == "Folder") {
                    setPath(f.path);
                    getFiles();
                  } else openFile(f);
                }}
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
