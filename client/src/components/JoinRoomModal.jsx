import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { RiLoader5Line } from 'react-icons/ri';
import '@fontsource-variable/fira-code';
import '@fontsource-variable/nunito';
import '@fontsource-variable/faustina';

import { useNavigate } from 'react-router-dom';
const uuidV4Regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Define the schema
const JoinRoomSchema = z.object({
  apartment_id: z
    .string()
    .length(36, 'Enter a valid apartment id') // Length of a UUID is 36 characters including hyphens
    .regex(
      uuidV4Regex,
      'Invalid apartment ID format. Must be a valid UUID v4.'
    ), // Add regex for validation
  flat_id: z.string().min(3, 'Flat ID must be at least 3 characters long'),
  terms_check: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

function JoinRoomModal() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [error, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(JoinRoomSchema),
  });

  const onSubmit = async (formdata) => {
    axios.defaults.withCredentials = true;
    setLoading(true);
    setError(false);
    setErrorMsg('');
    axios.defaults.withCredentials = true;
    let response;
    try {
      const formData = {
        apartment_id: formdata.apartment_id,
        flat_id: formdata.flat_id,
      };
      response = await axios.post('http://localhost:5000/join-room', formData);
      if (response.status === 200) {
        navigate(`/room/${formData.apartment_id}`);
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setError(true);
        setErrorMsg('Failed to join room. Please try again');
      } else if (error.response?.status === 404) {
        setError(true);
        setErrorMsg('Apartment or Flat not found');
      } else if (error.response.status === 400) {
        setError(true);
        setErrorMsg('Flat ID is already registered ');
      } else {
        setError(true);
        setErrorMsg('Failed to join . Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full items-center px-4 sm:justify-center border-none shadow-none font-form  justify-center">
      <div className="card w-full max-sm:w-96 p-6 border-none shadow-none max-h-inherit max-lg:px-0 flex flex-col items-center h-full justify-center gap-6">
        <div className="card-header flex items-center justify-center gap-2  flex-col">
          <div className="card-title flex items-center justify-center text-nowrap max-sm:text-lg font-title !text-2xl">
            Join your Apartment Room
          </div>
        </div>
        <div className="card-content grid gap-y-1 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-item">
              <label
                className={`form-item ${
                  errors.apartment_id && 'text-destructive'
                } form-label`}
              >
                Enter the Apartment ID
              </label>
              <input
                autoFocus
                disabled={isLoading}
                placeholder="Identify your Apartment"
                type="text"
                {...register('apartment_id', { required: true })}
                className="input"
              />
              {errors.apartment_id && (
                <p className=" form-message">{errors.apartment_id.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={`form-item ${
                  errors.flat_id && 'text-destructive'
                } form-label`}
              >
                Enter the Flat ID
              </label>
              <input
                disabled={isLoading}
                placeholder="Flat ID"
                type="text"
                {...register('flat_id', { required: true })}
                className="input"
              />
              {errors.flat_id && (
                <p className=" form-message">{errors.flat_id.message}</p>
              )}
            </div>

            <div className="items-top flex space-x-2">
              <div className="grid gap-1.5 leading-none">
                <div className="flex gap-2 items-center justify-left">
                  <input
                    type="checkbox"
                    {...register('terms_check', { required: true })}
                    className={`checkbox${
                      errors.terms_check ? 'border-destructive' : ''
                    }`}
                  />
                  <label
                    htmlFor="terms_check"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  You agree to our Terms of Service and Privacy Policy.
                </p>
                {errors.terms_check && (
                  <p className="form-message">{errors.terms_check.message}</p>
                )}
              </div>
            </div>
            {isError && <p className=" form-message">{error}</p>}

            <div className="w-full grid place-items-center ">
              <button
                className="btn  !text-lg   max-sm:text-xs max-sm:px-2 max-sm:py-1 bg-slate-900 hover:bg-slate-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RiLoader5Line className="size-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinRoomModal;
