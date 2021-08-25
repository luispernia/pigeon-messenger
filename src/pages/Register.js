/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import userContext from "../services/context/UserContext";
import GoogleSignIn from '../components/GoogleSignIn';
import Loading from '../components/Loading';
import Alert from "../components/Alert";
import ChatIcons from '../components/ChatIcons';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useSpring, animated } from 'react-spring';
import {useCookies} from "react-cookie"

const validate = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = "The name is required";
    }

    if (!values.email) {
        errors.email = "The email is required";
    }

    if (!values.password) {
        errors.password = "The password is required";
    }

    return errors;
}

function Register() {
    const { signUpEmail, alerts, setAlert } = useContext(userContext);
    const history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookies] = useCookies(["token"]);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validate,
        onSubmit: values => {
            setLoading("loading");
            signUpEmail({ name: formik.values.name, email: formik.values.email, password: formik.values.password }, (res) => {
                if (!res.ok) {
                    setAlert({ text: res.err })
                    return;
                }
                setLoading("Done");
                history.replace("/chat");
            });
        }
    })

    const title = useSpring({ to: { opacity: 1, transform: "translate(0rem, 0rem)" }, from: { opacity: 0, transform: "translate(-2rem, 0rem)" } });

    const [loading, setLoading] = useState("");
    const displays1 = useSpring({to: {opacity: 1, transform: "translate(0rem, 0rem)"}, from: {opacity: 0, transform: "translate(-1rem, 0rem)"}, delay: 400});
    const displays2 = useSpring({to: {opacity: 1, transform: "translate(0rem, 0rem)"}, from: {opacity: 0, transform: "translate(-1rem, 0rem)"}, delay: 600});

    useEffect(() => {
        setCookies("token", null, {path: "/"});
    }, [])

    return (
        <>
            {alerts.length > 0 ? (
                <Alert />
            ) : ("")}
            <div className="principal-page-view">
                <div className="landing">
                    <div className="landing-title">
                        <animated.h1 style={title}>Pigeon <span>Messenger</span></animated.h1>
                        <h3>Real-time messaging in a lightweight way</h3>
                    </div>
                    <div  className="landing-body">
                        <animated.div style={displays1} className="mobile">
                            <img src="/mobiles.gif" alt="mobile gif" />
                        </animated.div>
                        <animated.div style={displays2} className="desktop">
                        <img src="/desktops.gif" alt="desktop gif" />
                        </animated.div>
                    </div>
                </div>
                <div className="form-div">

                    <ChatIcons />

                    <form onSubmit={formik.handleSubmit} className="form">
                        <h2>Join</h2>
                        <GoogleSignIn history={history} type="register" loading={setLoading} />
                        <p>or</p>
                        <div className="control">
                            <label className="label">Name</label>
                            <input name="name" id="name" type="text " value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input" placeholder="Your name" />
                            {formik.touched.name && formik.errors.name ? <p className="form-error">{formik.errors.name}</p> : ""}
                        </div>

                        <div className="control">
                            <label className="label">Email</label>
                            <input name="email" id="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input" placeholder="example@example.com" />
                            {formik.touched.email && formik.errors.email ? <p className="form-error">{formik.errors.email}</p> : ""}
                        </div>


                        <div className="control">
                            <label className="label">Password</label>
                            <input name="password" id="password" type="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input" placeholder="Strong password" />
                            {formik.touched.password && formik.errors.password ? <p className="form-error">{formik.errors.password}</p> : ""}
                        </div>

                        <button type="submit" className="submit">Next</button>
                        <p className="form-redirect">Already on site? <Link to="/login">login</Link> </p>
                    </form>
                </div>
            </div>
            {loading === "Loading" ? (
                <Loading />
            ) : ("")}
        </>
    )
}

export default Register
