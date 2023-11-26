import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import File from "./File";
import { FileObject } from "./File";
import styles from "./App.css";
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
  const [filename, setFilename] = useState("");
  const [doReverse, setDoReverse] = useState(true);
  async function getFiles() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setFiles(await invoke("get_files", { filename }));
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

  return (
    <div className="container">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          getFiles();
        }}
      >
        <button>
          <img
            src="https://static.thenounproject.com/png/4149528-200.png"
            className="previous-dir"
            width="30"
            height="30"
            
          />
        </button>
        <input
          id="greet-input"
          onChange={(e) => setFilename(e.currentTarget.value)}
          placeholder="Enter a filename..."
        />
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <FirstRowButton className="rounded-md" onClick={() => sortFiles("name")}>
              Name
            </FirstRowButton>
            <FirstRowButton onClick={() => sortFiles("file_type")}>
              Type
            </FirstRowButton>
            <FirstRowButton className="rounded-md" onClick={() => sortFiles("size")}>
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
                    setFilename(f.name);
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
