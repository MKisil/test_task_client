import { useEffect, useState } from "react";

import { API_URL } from "../config";
import "./FileList.css";

import FileItem from "./FileItem";

function FileList({ dirPath, setDirPath }) {
  const [files, setFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalFilename, setModalFilename] = useState("");
  const [sortBy, setSortBy] = useState(null);

  const fetchFiles = async () => {
    try {
      const url = sortBy
        ? `${API_URL}/directory/${dirPath}/?sort_by=${sortBy}`
        : `${API_URL}/directory/${dirPath}/`;

      const res = await fetch(url);
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  const navigateDir = async (dirPath) => {
    setDirPath(dirPath);
  };

  const readFile = async (filePath) => {
    try {
      const url = `${API_URL}/file/${filePath}/`;

      const res = await fetch(url);
      const data = await res.json();

      setModalContent(data);
      setModalFilename(filePath);
      setModalVisible(true);
    } catch (error) {
      console.error("Failed to read file:", error);
      alert("Failed to read file: " + error.error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [dirPath, sortBy]);

  return (
    <div className="file-list">
      <div>
        <div className="browser-ui">
          <div className="nav">
            {dirPath == "/" ? (
              <span></span>
            ) : (
              <button
                className="nav-back"
                onClick={() =>
                  navigateDir(dirPath.split("/").slice(0, -1).join("/") || "/")
                }
              >
                Back
              </button>
            )}
          </div>
          <div className="sort-files">
            <button onClick={() => setSortBy("size")}>Sort by size</button>
            <button onClick={() => setSortBy("modified")}>
              Sort by modified
            </button>
          </div>
        </div>
        <div>
          <div className="file-list-columns">
            <span>Name</span>
            <span>Type</span>
            <span>Modified</span>
            <span>Size</span>
            <span>Action</span>
          </div>
          <div>
            {files.map((file) => (
              <FileItem
                key={file.name}
                onClick={() => {
                  const path = dirPath.endsWith("/") ? dirPath : dirPath + "/";
                  file.is_file
                    ? readFile(path + file.name, file.name)
                    : navigateDir(path + file.name);
                }}
                dirPath={dirPath}
                name={file.name}
                isFile={file.is_file}
                metadata={file.metadata}
                onDelete={() => fetchFiles()}
              />
            ))}
          </div>
        </div>
      </div>
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modalFilename}</h3>
            <p>{modalContent}</p>
            <button onClick={() => setModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileList;
