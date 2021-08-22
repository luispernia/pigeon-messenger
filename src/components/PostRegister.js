import React, { useContext, useState, useRef } from 'react'
import { useSpring, animated } from 'react-spring';
import userContext from '../services/context/UserContext';
import axios from "axios";
import Cropper from "react-cropper";
import { Formik } from 'formik';
import "cropperjs/dist/cropper.css"

function PostRegister() {

    const { user, refresh_token, token } = useContext(userContext);
    const spring = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 300 });

    const [photo, setPhoto] = useState("");
    const [file, setFile] = useState("");
    const [cropper, setCropper] = useState("");
    const [showCropper, setShowCropper] = useState("");
    const [ended, setEnded] = useState("");
    const fileRef = useRef("");

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
                            <form className="finish-control">
                                <p>username</p>
                                <div className="input">
                                    <i class="bi bi-at"></i>
                                    <input type="text" placeholder="your username" />
                                </div>
                                <button>Submit</button>
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
