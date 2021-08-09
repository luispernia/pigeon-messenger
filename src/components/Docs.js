import React, { useState } from 'react'
import axios from 'axios';


function Docs() {

    const [doc, setFile] = useState({docs: []});
    const [img, setImg] = useState(null);
    const [author, setAuthor] = useState(null);
    const [text, setText] = useState(null);

 
    const handleOnSubmit = async ($event) => {
        $event.preventDefault();
        
        console.log(doc);
        
        let formData = new FormData();

        for(let file of doc.docs) {
            formData.append("docs", file);
        }

        formData.append("document", JSON.stringify({author: "6103872f334b6d4cf08d6f0a", text: "Hello Boy!sadad", room_id: "Polars"}));   
        
        console.log(JSON.stringify({author: "6103872f334b6d4cf08d6f0a", text: "Hello Boy!sadad", room_id: "Polars"}));

        let res = await axios.post("http://localhost:8080/message/docs", formData, {headers: {
            "Content-Type": "multipart/form-data"
        }}).catch(err => {
            alert(err);
        })

        console.log(res);

        // if(res) {
        //     let message = await axios.post("http://localhost:8080/message", {
        //         text: "Hello Friend!",
        //         author: "6103872f334b6d4cf08d6f0a",
        //         img: res.data.user.img,
        //         room_id: "Power"
        //     })
            
        //     let fullMessage = await axios.get("http://localhost:8080/message/Power");
        //     let user = await axios.get(`http://localhost:8080/user/${fullMessage.data.message[0].author}`)

        //     setText(fullMessage.data.message[0].text)
        //     setAuthor(user.data.user.username);
        //     setImg(fullMessage.data.message[0].img)

        // }       

    }   

    return (
        <div>
            <form onSubmit={handleOnSubmit}>
                <input onChange={($event) => setFile({docs: [...doc.docs, ...$event.currentTarget.files]})} type="file" name="docs" multiple/>
                <button type="submit">Submit</button>
            </form>        
        </div>
    )
}

export default Docs
