import {Buffer} from "buffer";
import documentIcon from "../../public/document-icon.png"
const FileUpload = ({setFileUploaded}) => {
    const handleFileUpload = async (event) =>{
        const fileUpload = await event.target.files[0].arrayBuffer();
        const file = {
            type: event.target.files[0].type,
            file: Buffer.from(fileUpload).toString("base64"),
            imageURL: event.target.files[0].type.includes("pdf")|| event.target.files[0].type.includes("csv")||event.target.files[0].type.includes("doc")||event.target.files[0].type.includes("docx") ? documentIcon : URL.createObjectURL(event.target.files[0])
        }
        setFileUploaded(file);
    } 
    return(
        <section>
            <h2>
            Get Started
            </h2>
            <input 
                type = "file"
                accept = ".pdf, .jpg, .jpeg, .png, .csv, .doc, .docx"
                onChange = {handleFileUpload}
            />
        </section>
    )
}

export default FileUpload