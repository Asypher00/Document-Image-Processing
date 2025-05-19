// import {Buffer} from "buffer";
// import documentIcon from "../../public/document-icon.png"
// const FileUpload = ({setFileUploaded}) => {
//     const handleFileUpload = async (event) =>{
//         const fileUpload = await event.target.files[0].arrayBuffer();
//         const file = {
//             type: event.target.files[0].type,
//             file: Buffer.from(fileUpload).toString("base64"),
//             imageURL: event.target.files[0].type.includes("pdf")|| event.target.files[0].type.includes("csv")||event.target.files[0].type.includes("doc")||event.target.files[0].type.includes("docx") ? documentIcon : URL.createObjectURL(event.target.files[0])
//         }
//         setFileUploaded(file);
//     } 
//     return(
//         <section>
//             <h2>
//             Get Started
//             </h2>
//             <input 
//                 type = "file"
//                 accept = ".pdf, .jpg, .jpeg, .png, .csv, .doc, .docx"
//                 onChange = {handleFileUpload}
//             />
//         </section>
//     )
// }

// export default FileUpload

import { Buffer } from "buffer";
import documentIcon from "../../public/document-icon.png";
import { useState } from "react";

const FileUpload = ({ setFileUploaded }) => {
  const [error, setError] = useState("");

  const handleFileUpload = async (event) => {
    try {
      setError("");
      const file = event.target.files[0];
      
      if (!file) return;
      
      const fileType = file.type;
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      // Handle file based on type
      const fileArrayBuffer = await file.arrayBuffer();
      const fileBase64 = Buffer.from(fileArrayBuffer).toString("base64");
      
      // Determine if the file is a document type for icon display
      const isDocument = 
        fileType.includes("pdf") || 
        fileType.includes("csv") || 
        fileType.includes("doc") || 
        fileType.includes("docx") ||
        fileExtension === "pdf" ||
        fileExtension === "csv" ||
        fileExtension === "doc" ||
        fileExtension === "docx";
      
      // Create the file object with all necessary information
      const fileObject = {
        type: fileType,
        name: fileName,
        extension: fileExtension,
        file: fileBase64,
        size: file.size,
        imageURL: isDocument ? documentIcon : URL.createObjectURL(file)
      };
      
      setFileUploaded(fileObject);
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Failed to process the file. Please try again.");
    }
  };

  return (
    <section className="file-upload-container">
      <h2>Get Started</h2>
      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png, .csv, .doc, .docx"
        onChange={handleFileUpload}
      />
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default FileUpload;