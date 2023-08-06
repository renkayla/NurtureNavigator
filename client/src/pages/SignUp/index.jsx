import React, { useState } from 'react';
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import { REGISTER } from "../../utils/mutations";

function SignUp() {
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', password: '' });

  // Ignore the 'no-unused-vars' warnings for the following variables
  // eslint-disable-next-line no-unused-vars
  const [mutationError, setMutationError] = useState('');
  // Rename 'error' to 'formError'
  // eslint-disable-next-line no-unused-vars
  const [formError, setFormError] = useState();
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState();

  const [register, { error }] = useMutation(REGISTER);
  const navigate = useNavigate();


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await register({
        variables: { ...formState }
      });
  
      // Access the response data
      console.log("Response Data:", response.data);
  
      // Redirect to the login page after successful signup
      navigate('/login');
    } catch (error) {
      setMutationError(error.message);
      console.error("Mutation Error:", error);
    }
  };
  
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 pt-20 pb-40 mb-26 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create Account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                Enter your First Name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="name"
                required
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                Enter your Last Name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="name"
                required
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Enter your email 
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
            </div>
          </div>

          {/* Error message for mutation error */}
          {mutationError && <div>Error: {mutationError}</div>}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp;
