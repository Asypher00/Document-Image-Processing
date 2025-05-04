import "./Chat.css"
import { useState } from "react";
import {GoogleGenerativeAI} from "@google/generative-ai"
const Chat = ({fileUploaded}) => {
    const genAI = new GoogleGenerativeAI("AIzaSyCkF94Iz1X5sil910zwuDRPI77VqI7kcww");
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("")

    const handleSendMessage = async () => {
        if(input.length){
            let chatMessages = [...messages, {
                role: "user",
                text: input
            },{role: "loader", text: ""}];
            setInput("")
            setMessages(chatMessages)

            try {
                const result = await model.generateContent([
                    {
                        inlineData: {
                            data : fileUploaded.file,
                            mimeType : fileUploaded.type 
                        },
                    },
                    `Answer this question about the attached document: ${input}.Feel free to search the internet for more information if required.
                    Answer as chatbot with short messages and text only(no markdowns, tags or symbols).
                    Chat History ${JSON.stringify(messages)}`
                ]);
                chatMessages = [...chatMessages.filter((msg)=>msg.role!="loader"), {role: "model", text: result.response.text()},]
                setMessages(chatMessages)
            } catch (error) {
                chatMessages = [...chatMessages.filter((msg)=>msg.role!="loader"), {role: "error", text: `${error}`}]
                setMessages(chatMessages)
            }
    
        }

    }
    return(
        <section className = "chat-window">
            <h2>Chat</h2>
            {
                messages.length ?
                <div className="chat">
                    {
                     messages.map((msg, index) => (
                        <div className = {msg.role} key = {index}>
                            <p>{msg.text}</p>
                        </div>
                        ))   
                    }
                </div> :
                ""
            }
            
            <div className="input-area">
                <input value = {input} type="text" placeholder="Ask any question about the uploaded document" 
                onChange = {(e)=>setInput(e.target.value)}/>
                <button onClick = {handleSendMessage}>Send</button>
            </div>
        </section>
    )
}

export default Chat; 