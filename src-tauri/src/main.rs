use async_recursion::async_recursion;
use bytesize::ByteSize;
use serde::{Deserialize, Serialize};
use std::env;
use std::ffi::OsStr;
use std::fs;
use std::path::Path;
use tauri::{LogicalSize, Manager, WindowEvent};
extern crate bytesize;
extern crate open;
#[cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();

            main_window.set_min_size(Some(LogicalSize {
                width: 660,
                height: 400,
            }))?;
            Ok(())
        })
        .on_window_event(|e| {
            if let WindowEvent::Resized(_) = e.event() {
                std::thread::sleep(std::time::Duration::from_nanos(1));
            }
        })
        .invoke_handler(tauri::generate_handler![
            get_files,
            open_file,
            sort_files,
            find_file,
            get_upper_dir,
            get_upper_dir_path
        ])
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

    let files = if do_reverse {
        files.into_iter().rev().collect()
    } else {
        files
    };
    files
}
#[tauri::command]
#[async_recursion]
async fn find_file(file_name: &str, path: &str) -> Result<Vec<File>, ()> {
    let mut filtered_list: Vec<File> = vec![];
    let files = get_files(path.to_string());
    for file in files {
        if file.file_type == "Folder" {
            filtered_list.append(&mut find_file(file_name, &file.path).await.unwrap());
        }
        if file.name.contains(file_name) {
            filtered_list.push(file);
        }
    }
    Ok(filtered_list)
}
#[tauri::command]
fn get_upper_dir(path: &str) -> Vec<File> {
    get_files(get_upper_dir_path(path))
}

#[tauri::command]
fn get_upper_dir_path(path: &str) -> String {
    Path::new(path)
        .parent()
        .unwrap()
        .to_path_buf()
        .display()
        .to_string()
}
#[tauri::command]
fn get_files(path: String) -> Vec<File> {
    let paths = if path == "" {
        fs::read_dir(env!("HOME", "HOME variable not set")).unwrap()
    } else {
        fs::read_dir(path).unwrap()
    };
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
                        path: fs::canonicalize(e.path()).unwrap().display().to_string(),
                    })
                })
            })
        })
        .collect::<Vec<File>>();
    files.sort();
    files
}
#[tauri::command]
fn open_file(file: File) {
    let _ = open::that(file.path);
}
