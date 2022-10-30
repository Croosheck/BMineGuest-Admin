import "./Login.css";
import React, { useEffect, useRef, useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();

	useEffect(() => {
		emailRef.current.value = "restaurant4@test.com";
		passwordRef.current.value = "123123";
	}, []);

	async function submitHandler(e) {
		e.preventDefault();
		let enteredEmail = emailRef.current.value;
		let enteredPassword = passwordRef.current.value;

		const response = await signInWithEmailAndPassword(
			auth,
			enteredEmail,
			enteredPassword
		);

		console.log(response);
	}

	return (
		<div className="container">
			<h2>Sign In to Your Profile</h2>
			<form className="inputs-container" onSubmit={submitHandler}>
				<input
					className="input-field"
					type="email"
					placeholder="Email"
					ref={emailRef}
					required={true}
				/>
				<input
					className="input-field"
					type="password"
					placeholder="Password"
					ref={passwordRef}
					required={true}
				/>
				<div className="buttons-container">
					<button type="submit" className="button">
						Log In
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
