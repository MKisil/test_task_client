import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = process.env.API_URL || "http://127.0.0.1:8080";

function App() {
  const [files, setFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [readFileName, setReadFileName] = useState("");
  const [readFileContent, setReadFileContent] = useState("");
  const [filenameSearchQuery, setFilenameSearchQuery] = useState("");
  const [contentSearchQuery, setContentSearchQuery] = useState("");
  const [filenameSearchResults, setFilenameSearchResults] = useState([]);
  const [contentSearchResults, setContentSearchResults] = useState([]);
  const [dirPath, setDirPath] = useState("");
  const [dirFiles, setDirFiles] = useState([]);
  const [editFileName, setEditFileName] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteFileName, setDeleteFileName] = useState("");
  const [metadataFileName, setMetadataFileName] = useState("");
  const [metadata, setMetadata] = useState("");

  const fetchFiles = async (sortBy = null) => {
    try {
      const url = sortBy
        ? `${API_URL}/files/?sort_by=${sortBy}`
        : `${API_URL}/files/`;

      const res = await fetch(url);
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  const createFile = async () => {
    try {
      const res = await fetch(`${API_URL}/files/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFileName, content: newFileContent }),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Error creating file.");
        return;
      }
      setNewFileName("");
      setNewFileContent("");
      fetchFiles();
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const readFile = async () => {
    try {
      const res = await fetch(`${API_URL}/files/${readFileName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setReadFileContent(data.content);
      } else {
        const error = await res.json();
        alert(error.error || "Error reading file.");
        return;
      }
      setReadFileName("");
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };

  const deleteFile = async () => {
    try {
      const res = await fetch(`${API_URL}/files/${deleteFileName}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("File deleted");
        setDeleteFileName("");
        fetchFiles();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const saveEditFile = async () => {
    try {
      const res = await fetch(`${API_URL}/files/${editFileName}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });
      if (res.ok) {
        alert("File updated");
        setEditFileName("");
        setEditContent("");
        fetchFiles();
      } else {
        const error = await res.json();
        alert(error.error || "Error editing file.");
        return;
      }
    } catch (err) {
      console.error("Failed to save file:", err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const res = await fetch(`${API_URL}/metadata/${metadataFileName}/`);
      if (res.ok) {
        const data = await res.json();
        setMetadata(data);
      } else {
        const error = await res.json();
        alert(error.error || "Error editing file.");
        return;
      }
    } catch (err) {
      console.error("Failed to fetch metadata:", err);
    }
  };

  const searchByFilename = async () => {
    try {
      const res = await fetch(
        `${API_URL}/search/filename/?q=${encodeURIComponent(
          filenameSearchQuery
        )}`
      );
      const data = await res.json();
      setFilenameSearchResults(data);
    } catch (error) {
      console.error("Error searching filename:", error);
    }
  };

  const searchByContent = async () => {
    try {
      const res = await fetch(
        `${API_URL}/search/content/?q=${encodeURIComponent(contentSearchQuery)}`
      );
      const data = await res.json();
      setContentSearchResults(data);
    } catch (error) {
      console.error("Error searching content:", error);
    }
  };

  const fetchDirectoryFiles = async () => {
    try {
      const res = await fetch(
        `${API_URL}/directories/?path=${encodeURIComponent(dirPath)}`
      );
      const data = await res.json();
      setDirFiles(data);
    } catch (error) {
      console.error("Error fetching directory:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="app">
      <h1 className="title">Simple File System</h1>

      <section className="card">
        <h2>All Files</h2>

        <div class="buttons-group">
          <button onClick={() => fetchFiles("name")}>Sort by Name</button>
          <button onClick={() => fetchFiles("size")}>Sort by Size</button>
        </div>

        <ul>
          {files.length > 0 ? (
            files.map((file) => <li key={file}>{file}</li>)
          ) : (
            <li>...</li>
          )}
        </ul>
      </section>

      <section className="card">
        <h2>Create File</h2>
        <input
          type="text"
          placeholder="Filepath"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
        <textarea
          placeholder="File content"
          value={newFileContent}
          onChange={(e) => setNewFileContent(e.target.value)}
          rows={4}
        />
        <button onClick={createFile}>Create</button>
      </section>

      <section className="card">
        <h2>Read File</h2>
        <input
          type="text"
          placeholder="Filepath"
          value={readFileName}
          onChange={(e) => setReadFileName(e.target.value)}
        />
        <button onClick={readFile}>Read</button>
        <p>{readFileContent}</p>
      </section>

      <section className="card">
        <h2>Delete File</h2>
        <input
          type="text"
          placeholder="Filepath to delete"
          value={deleteFileName}
          onChange={(e) => setDeleteFileName(e.target.value)}
        />
        <button onClick={deleteFile}>Delete</button>
      </section>

      <section className="card">
        <h2>Edit File</h2>
        <input
          type="text"
          placeholder="Filepath"
          value={editFileName}
          onChange={(e) => setEditFileName(e.target.value)}
        />
        <textarea
          placeholder="File content"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={4}
        />
        <button onClick={saveEditFile}>Edit</button>
      </section>

      <section className="card">
        <h2>View Metadata</h2>
        <input
          type="text"
          placeholder="Filepath"
          value={metadataFileName}
          onChange={(e) => setMetadataFileName(e.target.value)}
        />
        <button onClick={fetchMetadata}>Fetch</button>
        {metadata ? (
          <>
            <p>Created: {metadata.created}</p>
            <p>Modified: {metadata.modified}</p>
            <p>Size: {metadata.size}</p>
          </>
        ) : (
          <p></p>
        )}
      </section>

      <section className="card">
        <h2>Search by Filename</h2>
        <input
          type="text"
          placeholder="Enter filepath"
          value={filenameSearchQuery}
          onChange={(e) => setFilenameSearchQuery(e.target.value)}
        />
        <button onClick={searchByFilename}>Search</button>
        <ul>
          {filenameSearchResults.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Search by Content</h2>
        <input
          type="text"
          placeholder="Enter text"
          value={contentSearchQuery}
          onChange={(e) => setContentSearchQuery(e.target.value)}
        />
        <button onClick={searchByContent}>Search</button>
        <ul>
          {contentSearchResults.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>List Directory Files</h2>
        <input
          type="text"
          placeholder="Enter directory path"
          value={dirPath}
          onChange={(e) => setDirPath(e.target.value)}
        />
        <button onClick={fetchDirectoryFiles}>List Directory</button>
        <ul>
          {dirFiles.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
