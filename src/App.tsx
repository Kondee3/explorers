import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import File from "./File";
import { FileObject } from "./File";
import "./App.css";
import FirstRowButton from "./FirstRowButton";
function App() {
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [doReverse, setDoReverse] = useState(false);
  async function getFiles() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setFiles(await invoke("get_files", { filename }));
  }
  async function openFile(name: string) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    await invoke("open_file", { name });
  }
  async function sortFiles(columnName: string) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setFiles(await invoke("sort_files", { files, columnName, doReverse}));
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
        <input
          id="greet-input"
          onChange={(e) => setFilename(e.currentTarget.value)}
          placeholder="Enter a filename..."
        />
        <button type="submit">Greet</button>
      </form>
      <table>
        <thead>
          <tr>
            <FirstRowButton onClick={() => sortFiles( "name")}>
              Name
            </FirstRowButton>
            <FirstRowButton onClick={() => sortFiles( "file_type")}>
              Type
            </FirstRowButton>
            <FirstRowButton onClick={() => sortFiles( "size")}>
              Size
            </FirstRowButton>
          </tr>
        </thead>
        <tbody>
          {files.map((f: FileObject, id: number) => {
            return <File file={f} onClick={() => openFile(f.name)} key={id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
