import React, { useContext, useState, useRef } from 'react'
import { useSpring, animated } from 'react-spring';
import userContext from '../services/context/UserContext';
import axios from "axios";
import Cropper from "react-cropper";
import Loading from './Loading';
import Alert from "./Alert";
import { useFormik } from "formik";
import { useHistory } from 'react-router';
import "cropperjs/dist/cropper.css"

const validate = (values) => {  
    const errors = {};
    var alpha = /^[a-zA-Z\s]*$/; 

    if(!values.username) {
        errors.username = "Required";
    }
    
    if(!alpha.test(values.username)) {
        errors.username = "Only [a-z] letters"
    }

    if(values.username.length > 14) {
        errors.username = "Max length 10 characters"
    }


    return errors;
}


function PostRegister() {
    
    const history = useHistory();
    const { user, refresh_token, token, finishSettings, setAlert, alerts } = useContext(userContext);
    const spring = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 300 });
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: ""
        },
        validate,
        onSubmit: async values => {
            let {data} = await compare(values.username);
            if(!data.user) {
                setLoading(true)
                finishSettings({id: user._id, username: values.username},(res) => {
                    if(res.ok) {
                        setLoading(false);
                        history.replace("/chat")
                    }
                })
            } else {
                setAlert({text: "Username already exist"});
            }
        }
    })    
    
    const [photo, setPhoto] = useState("");
    const [file, setFile] = useState("");
    const [cropper, setCropper] = useState("");
    const [showCropper, setShowCropper] = useState("");
    const [ended, setEnded] = useState("");
    const fileRef = useRef("");
    
    const compare = async (value) => {
        let res = axios.get(`http://localhost:8080/user/search/${value}`, {withCredentials: true});
        return res;
    }

    const getData = ($event) => {
        $event.preventDefault();
        let canvas = cropper.getCroppedCanvas({ width: 160, height: 160, imageSmoothingQuality: 'high', });
        canvas.toBlob((blob) => {
            let formData = new FormData();
            formData.append("photo", blob, "user.png");
            axios.post(`http://localhost:8080/user/upload/${user._id}`, formData, { withCredentials: true })
                .then((res) => {
                    setEnded(canvas.toDataURL("image/png"));
                    setShowCropper(false);
                    console.log(res);
                    refresh_token({ bool: true, user: res.data.user });
                })
                .catch(err => {
                    console.log(err);
                })
        })
    }



    return (
        <>  
            {alerts.length > 0 ? (
                <Alert />
            ) : ("")}
            {loading? (<Loading />) : ("")}
            {showCropper ? (
                <div className="crop-contain">
                    <Cropper
                        autoCropArea={true}
                        src={photo}
                        viewMode={2}
                        style={{ height: "400px", width: "100%" }}
                        background={false}
                        responsive={true} aspectRatio={1}
                        onInitialized={(instance) => { setCropper(instance) }} />
                    <button className="set-image" onClick={($event) => getData($event)}>Done</button>
                </div>
            ) : (
                <animated.div style={spring} className="finish-settings">
                    <div className="finish-header">
                        <h1>Finish Settings</h1>
                        <p>Before you continue</p>
                    </div>
                    <div className="finish-container">
                        <div onClick={() => {
                            fileRef.current.click();
                        }} className="user-image-icon" style={{ backgroundImage: ` url(${ended ? ended : `http://localhost:8080/upload/user/${user.img}?token=${token}`})`, backgroundSize: "cover" }}>
                           
                            <div className="container-user">
                           <i class="bi bi-image"></i>  
                            </div>
                            <input style={{ display: "none" }} value={file} onChange={($event) => {
                                if ($event.target.files.length >= 1) {
                                    let src = URL.createObjectURL($event.target.files[0]);
                                    setPhoto(src);
                                    setFile($event.target.file);
                                    setShowCropper(true);
                                }
                            }} ref={fileRef} type="file" />
                        </div>
                        <div className="finish-body">
                            <form onSubmit={formik.handleSubmit} className="finish-control">
                                <p>username</p>
                                <div className="control-container">  
                                    <div className="input">
                                        <i class="bi bi-at"></i>
                                        <input name="username" id="username" value={formik.values.username} onChange={formik.handleChange} type="text" placeholder="your username" />
                                    </div>
                                    {formik.errors.username?  <small>{formik.errors.username}</small> : "" }
                                </div>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                </animated.div>
            )
            }
        </>
    )
}

export default PostRegister
