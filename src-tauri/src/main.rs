use bytesize::ByteSize;
use serde::{Deserialize, Serialize};
use std::ffi::OsStr;
use std::fs;
extern crate bytesize;
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_files, open_file, sort_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
#[derive(Serialize, Deserialize, Ord, Eq, PartialEq, PartialOrd)]
struct File {
    name: String,
    file_type: String,
    size: String,
    path: String,
}

fn from_extension(x: Option<&OsStr>, is_dir: bool, name: String) -> String {
    if is_dir {
        return "Folder".to_string();
    }
    match x {
        Some(i) => i.to_str().unwrap().to_string(),
        None => name,
    }
}
#[tauri::command]
fn sort_files(mut files: Vec<File>, column_name: String, do_reverse: bool) -> Vec<File> {
    match column_name.as_str() {
        "name" => files.sort_by(|a, b| a.name.cmp(&b.name)),
        "file_type" => files.sort_by(|a, b| a.file_type.cmp(&b.file_type)),
        "size" => files.sort_by(|a, b| a.size.cmp(&b.size)),
        "path" => files.sort_by(|a, b| a.path.cmp(&b.path)),
        _ => println!("empty list"),
    };

    if do_reverse {
        files.into_iter().rev().collect()
    } else {
        files
    }
}
#[tauri::command]
fn get_files(filename: String) -> Vec<File> {
    let paths = fs::read_dir(filename).unwrap();
    let mut files = paths
        .filter_map(|entry| {
            entry.ok().and_then(|e| {
                e.path().file_name().and_then(|n| {
                    n.to_str().map(|s| File {
                        name: String::from(s),
                        file_type: from_extension(
                            e.path().extension(),
                            e.metadata().unwrap().is_dir(),
                            String::from(s),
                        ),
                        size: format!("{:?}", ByteSize(e.metadata().unwrap().len())),
                        path: fs::canonicalize(e.path())
                            .unwrap()
                            .to_path_buf()
                            .display()
                            .to_string(),
                        //path: e.path().into_os_string().into_string().unwrap(),
                    })
                })
            })
        })
        .collect::<Vec<File>>();
    files.sort();
    files
}
#[tauri::command]
fn open_file(name: String) {
    print!("\nścieżka{}\n", name);
    let open = fs::File::open(name);
}
