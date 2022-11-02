import { useState } from "react";

// object that allows us to keep track of multiple field inside of our form
import FormInput from "../form-input/form-input.component";
import CustomButton from "../button/button.component";

import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

import "./sign-up-form.styles.scss";

const defaultFormField = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormField);
  const { displayName, email, password, confirmPassword } = formFields;

  // method to clear out form fields
  const resetFormFields = () => {
    setFormFields(defaultFormField);
  };

  //method - to laverage the form field in order to actually create this method, async method - because we are generating a user document inside of an external service
  //sign-up user using email and password

  const handleSubmit = async (event) => {
    event.preventDefault();
    //1.confirm password matches
    //2.we need to see if we've authenticated that user with email and password,then creating a user document from what that returns
    if (password !== confirmPassword) {
      alert("password do not match");
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
    } catch (error) {
      //laverage error code
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  // storing and setting our state object from inputs values
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="sign-up-container">
      <h2>Don't have an account</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Display Name"
          type="text"
          required
          onChange={handleChange}
          name="displayName"
          value={displayName}
        />
        <FormInput
          label="Email"
          type="email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        <FormInput
          label="Confirm Password"
          type="password"
          required
          onChange={handleChange}
          name="confirmPassword"
          value={confirmPassword}
        />

        <CustomButton type="submit">Sign Up</CustomButton>
      </form>
    </div>
  );
};

export default SignUpForm;
