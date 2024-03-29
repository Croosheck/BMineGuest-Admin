import "./Login.css";
import { useEffect, useRef } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();

	useEffect(() => {
		emailRef.current.value = "restaurant3@test.com";
		passwordRef.current.value = "123123";
	}, []);

	async function submitHandler(e) {
		e.preventDefault();
		const enteredEmail = emailRef.current.value;
		const enteredPassword = passwordRef.current.value;

		await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
	}

	return (
		<div className="container">
			<h2>Sign In</h2>
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
