/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useContext} from 'react'
import {useHistory} from "react-router-dom";
import GoogleSignIn from '../components/GoogleSignIn';
import userContext from '../services/context/UserContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import ChatIcons from '../components/ChatIcons';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import {useCookies} from "react-cookie";
import { useEffect } from 'react';

const validate = (values) => {
    const errors = {};


    if(!values.email) {
        errors.email = "The email is required";
    }

    if(!values.password) {
        errors.password = "The password is required";
    }

    return errors;
}

function Login() {

    const { loginEmail, alerts } = useContext(userContext);
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(["token"]); 

    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate,
        onSubmit: values => {
                   
        setLoading("Loading");

        loginEmail({email: formik.values.email, password: formik.values.password}, (res) => {
            if(!res.ok) {
                setLoading("failed");
                return;
            }
            history.replace("/chat");
        })
        }
    })

    const [loading, setLoading] = useState("");
    
    const title = useSpring({to: {opacity: 1, transform: "translate(0rem, 0rem)"}, from: {opacity: 0, transform: "translate(-2rem, 0rem)"}});
    const displays1 = useSpring({to: {opacity: 1, transform: "translate(0rem, 0rem)"}, from: {opacity: 0, transform: "translate(-1rem, 0rem)"}, delay: 400});
    const displays2 = useSpring({to: {opacity: 1, transform: "translate(0rem, 0rem)"}, from: {opacity: 0, transform: "translate(-1rem, 0rem)"}, delay: 600});

    useEffect(() => {
        setCookie("token", null, {path: "/"});
    }, [])

    return (

        <div>
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
                        <h2>Welcome Back!</h2>
                        <GoogleSignIn history={history} type="login" loading={setLoading} />
                        <p>or</p>
                        <div className="control">
                            <label className="label">Email</label>
                            <input name="email" id="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input" placeholder="example@example.com" />
                            {formik.touched.email && formik.errors.email? <p className="form-error">{formik.errors.email}</p> : ""}
                        </div>
                        

                        <div className="control">
                            <label className="label">Password</label>
                            <input name="password" id="password" type="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className="input" placeholder="Strong password" />
                            {formik.touched.password && formik.errors.password? <p className="form-error">{formik.errors.password}</p> : ""}
                        </div>

                        <button type="submit" className="submit">Next</button>
                        <p className="form-redirect">New on site? <Link to="/register">Register</Link> </p>
                    </form>
                </div>
            </div>
            {loading === "Loading" ? (
                <Loading />
            ) : ("")}
        </div>

    )
}

export default Login;