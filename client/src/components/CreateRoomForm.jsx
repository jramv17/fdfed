import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RiLoader5Line } from 'react-icons/ri';
import Country_data from '../utils/CountryList.json';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useCreateRoom } from '../hooks/createRoomhook';

function CreateRoomForm() {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [error, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const CreateRoomHandler = useCreateRoom();
  const apartment_name_regex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/i;
  const pincode_regex = /^\d+$/;

  const CreateRoomFormSchema = z.object({
    name: z
      .string()
      .min(1, 'Provide a valid name')
      .max(40, 'Apartment should not exceeed 40 characters')
      .regex(apartment_name_regex, 'This is not a valid apartment name'),
    registeration_num: z
      .string()
      .min(8, 'Registeration num should be of length 6')
      .max(12, 'Registeration num should be of length of 12'),
    state: z.string().min(1, 'State'),
    address: z.string(),
    flat_id: z.string().min(3, 'Flat_id should be  of minimum length of 3'),
    pincode: z
      .string()
      .min(6, 'Provide a valid pincode')
      .max(6, 'Pincode must be 6 digits')
      .regex(pincode_regex, 'it can only contain numeric characters'),
    email: z.string().email('Provide a valid email'),
    subscription: z
      .string()
      .refine((val) => val === 'Basic' || val === 'Premium', {
        message: 'Subscription type should be either Basic or Premium',
      }),
    terms_check: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  });

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(CreateRoomFormSchema) });

  const onSubmit = async (formData) => {
    axios.defaults.withCredentials = true;

    setLoading(true);
    setError(false);
    setErrorMsg('');
    try {
      const formdata = {
        name: formData.name,
        address: formData.address,
        state: formData.state,
        flat_id: formData.flat_id,
        pincode: formData.pincode,
        registration_num: formData.registeration_num,
        email: formData.email,
        subscription: formData.subscription,
      };
      const res = CreateRoomHandler(formdata);
    } catch (error) {
      if (error.response.status === 400) {
        setError(true);
        setErrorMsg('Apartment already registered with this registration_num');
        reset();
      } else {
        reset();
        setError(true);
        setErrorMsg('Error in enrolling the apartment: ');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid w-full items-start px-4 sm:justify-center border-none shadow-none font-content min-h-[60vh]  justify-center">
      <div className="card w-full max-sm:w-96 p-6 border-none shadow-none max-h-inherit max-lg:px-0 flex flex-col items-center justify-center gap-6  h-full">
        <div className="card-header flex items-center justify-center gap-2 flex-col">
          <div className="card-title flex items-center justify-center text-nowrap max-sm:text-lg font-content !text-2xl">
            Register Your Community With Society Log
          </div>
          <div className="card-description flex items-center w-full justify-left text-nowrap max-sm:text-xs">
            One Stop Solution For Hastle Free Community
          </div>
        </div>

        <div className="card-content grid gap-y-1 w-full shadow-none">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-item">
              <label
                className={`form-item ${
                  errors.name ? 'text-destructive' : ''
                } form-label`}
              >
                Abode Name
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Abode Name"
                {...register('name', { required: true })}
                className={`input  !w-full ${
                  errors.name ? 'border-destructive' : ''
                }`}
              />
              {errors.name && (
                <p className="form-message">{errors.name.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={`${
                  errors.registeration_num ? 'text-destructive' : ''
                } form-label`}
              >
                Registration Number
              </label>
              <input
                type="text"
                placeholder="Registration Number"
                {...register('registeration_num', { required: true })}
                className={`input  !w-full ${
                  errors.registeration_num ? 'border-destructive' : ''
                }`}
                onChange={() => {
                  setError(false);
                }}
              />
              {errors.registeration_num && (
                <p className="form-message">
                  {errors.registeration_num.message}
                </p>
              )}
            </div>

            <div className="form-item">
              <label
                className={`${
                  errors.state ? 'text-destructive' : ''
                } form-label`}
              >
                Select Your State
              </label>
              <select
                {...register('state', { required: true })}
                className={`select !w-full ${
                  errors.state ? 'border-destructive' : ''
                }`}
                id="country"
                defaultValue={' '}
              >
                <option
                  value=""
                  disabled
                  selected
                  className="bg-background text-muted-foreground"
                >
                  Select Your State
                </option>
                {Country_data.map((country) => {
                  return (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  );
                })}
              </select>
              {errors.state && (
                <p className="form-message">{errors.state.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={`${
                  errors.address ? 'text-destructive' : ''
                } form-label`}
              >
                Address
              </label>
              <textarea
                placeholder="Address"
                {...register('address', { required: true })}
                className={`textarea ${
                  errors.Address ? 'border-destructive' : ''
                }`}
                onChange={() => {
                  setError(false);
                }}
              />
              {errors.address && (
                <p className="form-message">{errors.address.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={` ${
                  errors.pincode && 'text-destructive'
                } form-label`}
              >
                Pincode
              </label>
              <input
                type="text"
                disabled={isLoading}
                placeholder="PINCODE"
                {...register('pincode', { required: true })}
                className="input !w-full"
              />
              {errors.pincode && (
                <p className=" form-message">{errors.pincode.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={` ${errors.email && 'text-destructive'} form-label`}
              >
                Emergency Email
              </label>
              <input
                type="email"
                disabled={isLoading}
                placeholder="Email"
                {...register('email', { required: true })}
                className="input !w-full"
              />
              {errors.email && (
                <p className=" form-message">{errors.email.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                htmlFor="subscription"
                className={`form-label ${
                  errors.subscription ? 'text-destructive' : ''
                }`}
              >
                Subscription Method
              </label>

              <div className="radio-group-stack">
                <div className="radio-indicator ">
                  <input
                    id="basic"
                    className="radio-item"
                    type="radio"
                    {...register('subscription', {
                      required: 'Subscription method is required',
                    })}
                    value="Basic"
                  />
                  <label htmlFor="basic">Basic</label>
                </div>

                <div className="radio-indicator ">
                  <input
                    id="premium"
                    className="radio-item"
                    type="radio"
                    {...register('subscription', {
                      required: 'Subscription method is required',
                    })}
                    value="Premium"
                  />
                  <label htmlFor="premium">Premium</label>
                </div>

                {errors.subscription && (
                  <p className="form-message">{errors.subscription.message}</p>
                )}
              </div>
            </div>

            <div className="form-item">
              <label
                className={`${
                  errors.flat_id ? 'text-destructive' : ''
                } form-label`}
              >
                Owner Flat ID
              </label>
              <input
                type="text"
                placeholder="Flat ID"
                {...register('flat_id', { required: true })}
                className={`input  !w-full ${
                  errors.flat_id ? 'border-destructive' : ''
                }`}
                onChange={() => {
                  setError(false);
                }}
              />
              {errors.flat_id && (
                <p className="form-message">{errors.flat_id.message}</p>
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

            <div className="w-full grid place-items-start ">
              <button
                className="btn outline-btn rounded-md  group sm-btn !text-lg max-sm:text-xs max-sm:px-2 max-sm:py-1 !bg-slate-700 text-white hover:text-white flex items-center justify-center gap-2"
                disabled={isLoading || isSubmitting}
              >
                {isLoading ? (
                  <RiLoader5Line className="size-4 animate-spin" />
                ) : (
                  <span>Start My Journey</span>
                )}

                <FaArrowRightLong
                  size={20}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </button>
              {isError && <p className="form-message">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRoomForm;
