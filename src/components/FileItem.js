import { useState } from "react";

import { API_URL } from "../config";
import "./FileItem.css";

function FileItem({ onClick, dirPath, name, isFile, metadata, onDelete }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [modalFilename, setModalFilename] = useState("");

  const fileDelete = async () => {
    try {
      const filePath = (dirPath.endsWith("/") ? dirPath : dirPath + "/") + name;
      const res = await fetch(
        `${API_URL}/${isFile ? "file" : "directory"}/${filePath}/`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        onDelete();
      } else {
        const error = await res.json();
        console.error("Failed to delete:", error);
        alert("Failed to delete: " + error.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const fileEdit = async () => {
    try {
      const filePath = (dirPath.endsWith("/") ? dirPath : dirPath + "/") + name;
      const res = await fetch(`${API_URL}/file/${filePath}/`);
      const data = await res.json();
      setEditContent(data);
      setModalFilename(name);
      setModalVisible(true);
    } catch (error) {
      console.error("Failed to load file for editing:", error);
      alert("Failed to load file for editing: " + error.error);
    }
  };

  const fileEditSubmit = async () => {
    try {
      const filePath = (dirPath.endsWith("/") ? dirPath : dirPath + "/") + name;
      const res = await fetch(`${API_URL}/file/${filePath}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        setModalVisible(false);
      } else {
        const error = await res.json();
        console.error("Failed to save file:", error);
        alert("Failed to save file: " + error.error);
      }
    } catch (error) {
      console.error("Edit save error:", error);
    }
  };

  return (
    <div>
      <div className="file-item">
        <span className="filename" onClick={onClick}>
          {name}
        </span>
        <span>{isFile ? "File" : "Dir"}</span>
        <span>{new Date(metadata.modified * 1000).toLocaleString()}</span>
        <span>{metadata.size}</span>
        <span className="file-item-action">
          <span className="delete-file" onClick={fileDelete}>
            Delete
          </span>
          {isFile && (
            <>
              <span> | </span>
              <span className="edit-file" onClick={fileEdit}>
                Edit
              </span>
            </>
          )}
        </span>
      </div>
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Editing: {modalFilename}</h3>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={15}
              cols={60}
            />
            <div>
              <button onClick={fileEditSubmit}>Save</button>
              <button onClick={() => setModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileItem;
