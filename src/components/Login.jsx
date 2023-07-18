import React, { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from '../firebase/firebase.config';
import { Link } from 'react-router-dom';

const Login = () => {

    const auth = getAuth(app);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const emailRef = useRef();

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const pass = form.pass.value;
        console.log(email, pass);

        setSuccess('');
        setError('');

        // firbase
        signInWithEmailAndPassword(auth, email, pass)
            .then((userCredential) => {
                const loggedUser = userCredential.user;
                console.log(loggedUser);
                if (!userCredential.user.emailVerified) {
                    console.log('User hasnt been verified yet')
                }
                else {
                    console.log('User is verified!')
                }
                setSuccess('Successfully logged in!');
                event.target.reset();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage)
                setError(errorMessage);
            });
    }

    const handleResetPassword = event => {
        const email = emailRef.current;
        console.log(email)
        console.log(email.value)
        if (!email) {
            alert('Please provide an email address')
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('please check ur email')
            })
            .catch( error => {
                console.log(error);
                setError(error.message);
            })
    }






    return (
        <div>
            <h2>Please Login</h2>
            <Form onSubmit={handleLogin} className='w-25 mx-auto'>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name='email' ref={emailRef} placeholder="Enter email" required />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='pass' placeholder="Password" required />
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox" className="mb-3">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <p className='text-danger mt-3'>{error}</p>
                <p className='text-success mt-3'>{success}</p>
                <p>Forget password? <button onClick={handleResetPassword} className='btn btn-link'>Reset password</button></p>
                <p>New to this website? <Link to='/register'>Register now</Link> </p>
            </Form>
        </div>
    );
};

export default Login;