import React, { useContext, useState, useRef } from 'react'
import { useSpring, animated } from 'react-spring';
import roomsContext from '../services/context/RoomContext';
import userContext from '../services/context/UserContext';
import { useHistory } from 'react-router';
import axios from "axios";
import Cropper from "react-cropper";
import {api} from "../services/config";
import { useCookies } from 'react-cookie';
import "cropperjs/dist/cropper.css"

const ProfileSettings = () => {

    const { user, token, signOut, setAlert, refresh_token } = useContext(userContext);
    const [cookies] = useCookies(["token"]);
    const { refresh_rooms, setFocus, chats } = useContext(roomsContext);

    const history = useHistory();
    const opac = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const close = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: 1000 })
    const height = useSpring({ to: { height: 200, opacity: 1 }, from: { opacity: 0, height: 100 }, delay: 1000 })
    const width = useSpring({ to: { width: 400, opacity: 1 }, from: { opacity: 0, width: 300 }, delay: 500 })

    const [photo, setPhoto] = useState("");
    const [file, setFile] = useState("");
    const [cropper, setCropper] = useState("");
    const [showCropper, setShowCropper] = useState("");
    const [ended, setEnded] = useState("");
    const fileRef = useRef("");


    const logout = () => {
        signOut(() => {
            setAlert({ type: "info", text: "bye" });
            history.replace("/register");
        })
    }

    const getData = ($event) => {
        $event.preventDefault();
        let canvas = cropper.getCroppedCanvas({ width: 160, height: 160, imageSmoothingQuality: 'high', });
        canvas.toBlob((blob) => {
            let formData = new FormData();
            formData.append("photo", blob, "user.png");
            axios.post(`${api}/user/upload/${user._id}`, formData, {withCredentials: true, headers: {"Authorization": cookies.token}})
            .then((res) => {
                setEnded(canvas.toDataURL("image/png"));
                setShowCropper(false);
                refresh_token({bool: true, user: res.data.user});
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
                <>
                    <animated.div style={close} onClick={() => {
                        setFocus(false)
                        refresh_rooms();
                    }} className="close">
                        <animated.i style={close} className="bi bi-x-circle"></animated.i>
                    </animated.div>
                    <animated.h1 style={opac} className="settings-title">Settings <i className="bi bi-box"></i></animated.h1>
                    <animated.div style={{ ...height, ...width }} className="profile_settings">
                        <animated.div className="profile-resume">
                            <div onClick={() => {
                                fileRef.current.click();
                            }} className="user-image-icon" style={{ backgroundImage: ` url(${ended ? ended : `${api}/upload/user/${user.img}?token=${token}`})`, backgroundSize: "cover" }}>
                                <input style={{ display: "none" }} value={file} onChange={($event) => {
                                    if ($event.target.files.length >= 1) {
                                        let src = URL.createObjectURL($event.target.files[0]);
                                        setPhoto(src);
                                        setFile($event.target.file);
                                        setShowCropper(true);
                                    }
                                }} ref={fileRef} type="file" />
                            </div>
                            <div className="profile-info">
                                <h3><i className="bi bi-at" ></i>{user.username}</h3>
                                <p><i className="bi bi-collection-fill"></i> {chats.filter(e => !e.contact_id).length} Rooms</p>
                                <p><i className="bi bi-person-square"></i> {chats.filter(e => e.contact_id).length} Contacts</p>
                            </div>
                        </animated.div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <animated.button style={close} className="button-logout" onClick={() => logout()}>Logout <i className="bi bi-box-arrow-in-right"></i></animated.button>
                        </div>
                    </animated.div>

                </>
            )}

        </>
    )
}

export default ProfileSettings
