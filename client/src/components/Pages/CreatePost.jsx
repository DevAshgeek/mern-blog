import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();

    try {
      const response = await fetch(`${baseURL}/post`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        // Handle the response error here
        console.error("Request failed:", response.statusText);
      }
    } catch (error) {
      console.error("Request error:", error);
    }

    // if (response.ok) {
    //     setRedirect(true);
    // }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div>
      <form onSubmit={createNewPost}>
        <input
          type="title"
          value={title}
          placeholder={"title"}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <input
          type="summary"
          value={summary}
          placeholder={"Summary"}
          onChange={(ev) => setSummary(ev.target.value)}
        />

        <input type="file" onChange={(ev) => setFiles(ev.target.files)} />

        <ReactQuill
          value={content}
          onChange={(newValue) => setContent(newValue)}
          modules={modules}
          formats={formats}
        />

        <button style={{ marginTop: "5px" }} type="submit">
          Create Post
        </button>
      </form>
    </div>
  );
}
