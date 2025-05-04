import {GoogleGenerativeAI} from "@google/generative-ai"
import { useState,useEffect } from "react";
import Loader from "./Loader";
const Summary = ({fileUploaded}) =>{
    const genAI = new GoogleGenerativeAI("AIzaSyCkF94Iz1X5sil910zwuDRPI77VqI7kcww");
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const [summary, setSummary] = useState("")
    const [status, setStatus] = useState("idle")
    const getSummary = async () => {
        setStatus("loading")
        try {
            const result = await model.generateContent([
                {
                    inlineData: {
                        data : fileUploaded.file,
                        mimeType : fileUploaded.type 
                    },
                },
                `Summarize this document. Use only plain text with no markdowns or HTML tags`
            ]);
            setStatus("success")
            setSummary(result.response.text())
        } catch (error) {
            console.log(error)
            setStatus("error")
        }


    }

    useEffect(()=>{
        if( status === "idle")
        getSummary();
    },[status])
    return(
        <section className = "summary">
            <img src={fileUploaded.imageURL} alt = "Preview Image" />
            <h2>
                Summary
            </h2>
            {
                status === "loading" ?
                <Loader />:
                status === "success" ?
                <p>{summary}</p>:
                status === "Error" ?
                <p>Error getting the Summary</p>: 
                ""
            }

        </section>
    )
}

export default Summary