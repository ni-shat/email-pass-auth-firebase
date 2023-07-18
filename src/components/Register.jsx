import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';
import { Link } from 'react-router-dom';


const auth = getAuth(app);

const Register = () => {
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleEmailChange = (event) => {
        // console.log(event);
        console.log(event.target.value); 
        // console.log(email)
    }

    const handlePassBlur = (event) => {
        console.log(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        // console.log(event.target);
        // console.log(event.target.email);
        // console.log(event.target.password);
        console.log(email, password);

        setSuccess('');
        setError('');

        // validation
        if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
            console.log('must be 2 caps');
            setError('Password must contain atleast 2 uppercase letters.'); 
            return;
        }
        if(!/(?=.*[!@#$&*])/.test(password)){
            setError('Password must has one special case letter.'); 
            return;
        }
        if(!/(?=.*[0-9].*[0-9])/.test(password)){
            setError('Password must has two digits.'); 
            return;
        }
        if(password.length < 6){
            setError('Password must be of six characters.'); 
            return;
        }


        // create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const loggedUser = userCredential.user;
            console.log(loggedUser);
            setError('');
            event.target.reset();
            setSuccess('User has created successfully! ');
            emailVerification(loggedUser);
            updateUserData(loggedUser, name);
        })
        .catch(error => {
            console.error(error.message);
            setError(error.message);
            setSuccess('');
        })
    }

    const emailVerification = (loggedUser) => {
        sendEmailVerification(loggedUser)
            .then(() => {
                console.log('Please verify');
                alert('Please verify ur email')
            });
    }

    const updateUserData = (user, name) => {
        updateProfile(user, {
            displayName: name
        })
        .then(() => {
            console.log("user updated")
        })
        .catch(error => {
            console.error(error.message);
            setError(error.message);
        })
    }


    return (
        <div className='mx-auto'>
            <h2 className='mt-5 text-center'>Register</h2>
            <form className='w-50 mx-auto' onSubmit={handleSubmit} action="">
                <input className='rounded mt-3 w-100' type="text" name="name" id="name" placeholder='your name' required/>
                <br />
                <input className='rounded mt-3 w-100' onChange={handleEmailChange} type="email" name="email" id="email" placeholder='your email' required/>
                <br />
                <input className='rounded mt-3 w-100' onBlur={handlePassBlur} type="password" name="password" id="password" placeholder='your password' required/>
                <br />
                <p className={` ${error ? 'text-danger' : 'text-success'}  mt-3`}>{
                error ? error : success
                }</p>
                <input className='btn btn-primary' type="submit" name="submit" value="Register"/>
                <br />
            </form>
            <p className='mt-3 text-center'>Already have an account? <Link to='/login'>Log in</Link> </p>
        </div>
    );
};

export default Register;