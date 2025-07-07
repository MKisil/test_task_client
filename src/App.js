import { useState } from "react";
import "./App.css";
import FileList from "./components/FileList";
import { API_URL } from "./config";

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [entityType, setEntityType] = useState("file");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [dirPath, setDirPath] = useState("/");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = async () => {
    const url = `${API_URL}/${entityType}/`;
    const filePath = (dirPath.endsWith("/") ? dirPath : dirPath + "/") + name;
    const payload =
      entityType === "file" ? { path: filePath, content } : { path: filePath };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalVisible(false);
        setName("");
        setContent("");
        setEntityType("file");
        setRefreshKey((k) => k + 1);
      } else {
        const error = await res.json();
        console.error("Create failed:", error);
        alert("Create failed: " + error.error);
      }
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  return (
    <div className="file-browser">
      <div className="browser-ui">
        <span>{dirPath}</span>
        <button onClick={() => setModalVisible(true)}>+ Create</button>
      </div>
      <FileList key={refreshKey} dirPath={dirPath} setDirPath={setDirPath} />

      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create new {entityType}</h3>
            <label>
              Type:{" "}
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              >
                <option value="file">File</option>
                <option value="directory">Directory</option>
              </select>
            </label>
            <br />
            <label>
              Name:{" "}
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            {entityType === "file" && (
              <>
                <label>
                  Content:
                  <br />
                  <textarea
                    rows={6}
                    cols={50}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </label>
              </>
            )}
            <div>
              <button onClick={handleCreate}>Create</button>
              <button onClick={() => setModalVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
