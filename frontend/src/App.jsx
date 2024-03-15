import "./App.css";
import { RiSendPlane2Line } from "react-icons/ri";
import { FaRegFileImage } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { useState } from "react";
function App() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState({ text: "", color: "" });
  const [image, setImage] = useState(null);
  const [succed, setSucced] = useState(true);

  function handleFileChange(event) {
    /* check if the input file is empty or has a file*/
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  function validateSelectedFile() {
    const MAX_FILE_SIZE = 5120; //5 mb
    //if the input file is empty
    if (!file) {
      setMsg({ text: "No file selected", color: "red" });
      setSucced(false);
      return;
    }

    //Calculate the selected file's size in kilobytes
    const fileSizeKiloBytes = file.size / 1024;

    //Compare if the size is below the limit
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      setMsg({ text: "File is greater than maximum limit!", color: "red" });
      setSucced(false);
      return;
    } else {
      setSucced(true);
    }
    //disclaimer: it can work with largest size of images but in this case we only want 5 mb of images
  }

  async function handleUpload(event) {
    /*
    fetching the file using POST method
    */
    event.preventDefault();

    if (!succed) {
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    //post fetch
    setMsg({ text: "Uploading ...", color: "white" });
    try {
      await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: fd,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Bad response");
          }
          return res.arrayBuffer();
        })
        .then((arrayBuffer) => {
          const chunkSize = 2040; //work with largest images sizes
          let base = "";
          //convert the array buffer to a string
          const uint8array = new Uint8Array(arrayBuffer);

          //split the array in chunks
          for (let i = 0; i < uint8array.length; i += chunkSize) {
            const chunk = uint8array.subarray(i, i + chunkSize);
            base += btoa(String.fromCharCode(...chunk));
          }

          setMsg({ text: "Upload successful!", color: "green" });
          setImage(`data:image/jpeg;base64,${base}`);
        })
        .catch((err) => {
          setMsg({ text: "Upload failed!", color: "red" });
          setImage(null);
          console.error(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <span>
        <h1>YOLOv8 </h1>
        <FaMagnifyingGlass size="30px" />
      </span>
      <form onSubmit={handleUpload}>
        <label htmlFor="file_input">
          <FaRegFileImage size="23px" />
          <strong>Upload Image</strong> {"(Limit 5 mB)"}
        </label>

        {/*Input file */}
        <div id="input-field">
          <input
            id="file_input"
            name="file_input"
            placeholder="No file chosen"
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
            required
          />
          <button
            type="submit"
            onClick={validateSelectedFile}
            aria-label="submit Photo"
          >
            <RiSendPlane2Line size="25px" />
          </button>
        </div>
        <p>PNG, JPG or JPEG</p>
        {msg && (
          <span id="messageText" style={{ color: msg.color }}>
            {msg.text}
          </span>
        )}
      </form>
      {image ? (
        <div>
          <span>
            <FaRegFileImage size="25px" />
            <h3>Image Output</h3>
          </span>
          <img src={image} alt="Object detection" />
        </div>
      ) : null}
    </main>
  );
}

export default App;
