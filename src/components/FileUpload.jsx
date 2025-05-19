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

  // List of supported MIME types by the Google Generative AI API
  const supportedMimeTypes = [
    "text/plain",          // .txt
    "text/csv",            // .csv
    "application/pdf",     // .pdf
    "image/jpeg",          // .jpg, .jpeg
    "image/png",           // .png
    "image/webp",          // .webp
    "image/heic",          // .heic
    "image/heif"           // .heif
  ];

  // Function to check if file type is supported
  const isSupportedFileType = (fileType, extension) => {
    // Direct MIME type check
    if (supportedMimeTypes.includes(fileType)) {
      return true;
    }
    
    // Fallback to extension check if MIME type is not recognized
    const supportedExtensions = ["pdf", "csv", "txt", "jpg", "jpeg", "png", "webp", "heic", "heif"];
    return supportedExtensions.includes(extension.toLowerCase());
  };

  const handleFileUpload = async (event) => {
    try {
      setError("");
      const file = event.target.files[0];
      
      if (!file) return;
      
      const fileType = file.type;
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      // Check if file type is supported
      if (!isSupportedFileType(fileType, fileExtension)) {
        setError(`File type not supported by the AI API: ${fileExtension}. 
                  Supported formats are: PDF, CSV, TXT, JPG, PNG, WEBP, HEIC.`);
        return;
      }
      
      // Handle file based on type
      const fileArrayBuffer = await file.arrayBuffer();
      const fileBase64 = Buffer.from(fileArrayBuffer).toString("base64");
      
      // Determine if the file is a document type for icon display
      const isDocument = 
        fileType.includes("pdf") || 
        fileType.includes("csv") || 
        fileType.includes("txt") ||
        fileExtension === "pdf" ||
        fileExtension === "csv" ||
        fileExtension === "txt";
      
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
        accept=".pdf, .jpg, .jpeg, .png, .csv, .txt"
        onChange={handleFileUpload}
      />
      {error && <p className="error-message">{error}</p>}
      <p className="supported-formats">
        Supported formats: PDF, CSV, TXT, JPG/JPEG, PNG
      </p>
    </section>
  );
};

export default FileUpload;