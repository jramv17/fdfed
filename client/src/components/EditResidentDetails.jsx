import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { RiLoader5Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'antd';
const RemoveUserSchema = z.object({
  username: z.string().min(1, 'Please enter a username to remove'),
  terms_check: z.boolean().refine((val) => val === true, {
    message: 'You must check the conditions below',
  }),
});

const ComplaintUserSchema = z.object({
  complaint: z
    .string()
    .min(10, 'Please enter atleast 10 characters about the complaint'),
  username: z.string().min(1, 'Please enter a username to remove'),
  severity: z.string().min(1, 'Please enter a severity'),
  terms_check: z.boolean().refine((val) => val === true, {
    message: 'You must check the conditions below',
  }),
});

const RoleAssigningSchema = z.object({
  role: z.string().min(1, `Please enter the role for modification`),
  username: z.string().min(1, 'Please enter a username to remove'),
  terms_check: z.boolean().refine((val) => val === true, {
    message: 'You must check the conditions below',
  }),
});
function RemoveUserDetails({ apartment_id, roomdetailsData }) {
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
    resolver: zodResolver(RemoveUserSchema),
  });

  const onSubmit = async (formdata) => {
    axios.defaults.withCredentials = true;
    setLoading(true);
    setError(false);
    setErrorMsg('');
    axios.defaults.withCredentials = true;
    let response;
    try {
      if (formdata.username === '') {
        setError(true);
        setErrorMsg('Please enter a username to remove');
        return;
      }
      const formData = {
        apartment_id: apartment_id,
        username: formdata.username,
      };
      response = await axios.post(
        'http://localhost:5000/room-details/deleteuser',
        formData
      );
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
    <div className="grid w-full min-h-[40vh] items-center px-4 sm:justify-center border-none shadow-none font-form  justify-center">
      <div className="card w-full max-sm:w-96 p-6 border-none shadow-none max-h-inherit max-lg:px-0 flex flex-col items-center h-full justify-center gap-6">
        <div className="card-header flex items-center justify-center gap-2  flex-col">
          <div className="card-title flex items-center justify-center text-nowrap max-sm:text-lg font-title !text-2xl">
            Remove Users
          </div>
        </div>
        <div className="card-content grid gap-y-1 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-item">
              <label
                className={`${
                  errors.username ? 'text-destructive' : ''
                } form-label`}
              >
                Select The UserName
              </label>
              <select
                {...register('username', { required: true })}
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
                  Select Your Resident Name
                </option>
                {roomdetailsData.apartment_users.map((residents) => {
                  return (
                    <option
                      key={residents.apartment_name}
                      value={residents.apartment_name}
                    >
                      {residents.apartment_name}
                    </option>
                  );
                })}
              </select>
              {errors.username && (
                <p className="form-message">{errors.username.message}</p>
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
                    Pls Confirm as this action is not reversible
                  </label>
                </div>

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
                    <span>Delete User</span>
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
function EditUserRoles({ apartment_id, roomdetailsData }) {
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
    resolver: zodResolver(RoleAssigningSchema),
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
        apartment_id: apartment_id,
        username: formdata.username,
        role: formdata.role,
      };
      response = await axios.put(
        'http://localhost:5000/room-details/role-assign',
        formData
      );
      if (response.status === 200) {
        navigate(`/room/${formData.apartment_id}`);
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setError(true);
        setErrorMsg('Failed to join room. Please try again');
      } else if (error.response?.status === 404) {
        console.log(error);
        setError(true);
        setErrorMsg('Apartment or Flat not found');
      } else if (error.response.status === 400) {
        setError(true);
        setErrorMsg(
          'User is Already having a security role in another apartment'
        );
      } else {
        setError(true);
        setErrorMsg('Failed to join . Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full min-h-[40vh] items-center px-4 sm:justify-center border-none shadow-none font-form  justify-center">
      <div className="card w-full max-sm:w-96 p-6 border-none shadow-none max-h-inherit max-lg:px-0 flex flex-col items-center h-full justify-center gap-6">
        <div className="card-header flex items-center justify-center gap-2  flex-col">
          <div className="card-title flex items-center justify-center text-nowrap max-sm:text-lg font-title !text-2xl">
            Edit User Roles
          </div>
        </div>
        <div className="card-content grid gap-y-1 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-item">
              <label
                className={`${
                  errors.username ? 'text-destructive' : ''
                } form-label`}
              >
                Select The UserName
              </label>
              <select
                {...register('username', { required: true })}
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
                  Select Your Resident Name
                </option>
                {roomdetailsData.apartment_users.map((residents) => {
                  return (
                    <option key={residents.user_id} value={residents.user_id}>
                      {residents.apartment_name}
                    </option>
                  );
                })}
              </select>
              {errors.username && (
                <p className="form-message">{errors.username.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={`${
                  errors.role ? 'text-destructive' : ''
                } form-label`}
              >
                Role Level
              </label>
              <select
                {...register('role', { required: true })}
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
                ></option>
                <option
                  value="Resident"
                  selected
                  className="bg-background text-muted-foreground"
                >
                  Resident
                </option>
                <option
                  value="Authority"
                  selected
                  className="bg-background text-muted-foreground"
                >
                  Authority
                </option>
                <option
                  value="Security"
                  selected
                  className="bg-background text-muted-foreground"
                >
                  Security
                </option>
              </select>
              {errors.role && (
                <p className="form-message">{errors.role.message}</p>
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
                    Pls Confirm as this action is not reversible
                  </label>
                </div>

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
                    <span>Modify Roles</span>
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

function RaiseTicketOnResident({ apartment_id, roomdetailsData }) {
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
    resolver: zodResolver(ComplaintUserSchema),
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
        apartment_id: apartment_id,
        user_id: formdata.username,
        complaint: formdata.complaint,
        severity: formdata.severity,
      };
      response = await axios.post(
        'http://localhost:5000/room-details/raise-ticket',
        formData
      );
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
        console.log(error);
        setError(true);
        setErrorMsg('Failed to join . Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full min-h-[40vh] items-center px-4 sm:justify-center border-none shadow-none font-form  justify-center">
      <div className="card w-full max-sm:w-96 p-6 border-none shadow-none max-h-inherit max-lg:px-0 flex flex-col items-center h-full justify-center gap-6">
        <div className="card-header flex items-center justify-center gap-2  flex-col">
          <div className="card-title flex items-center justify-center text-nowrap max-sm:text-lg font-title !text-2xl">
            Raise Tickets On Residents
          </div>
        </div>
        <div className="card-content grid gap-y-1 w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-item">
              <label
                className={`${
                  errors.username ? 'text-destructive' : ''
                } form-label`}
              >
                Select The UserName
              </label>
              <select
                {...register('username', { required: true })}
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
                  Select Your Resident Name
                </option>
                {roomdetailsData.apartment_users.map((residents) => {
                  return (
                    <option key={residents.user_id} value={residents.user_id}>
                      {residents.apartment_name}
                    </option>
                  );
                })}
              </select>
              {errors.username && (
                <p className="form-message">{errors.username.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={`${
                  errors.severity ? 'text-destructive' : ''
                } form-label`}
              >
                Severity Level
              </label>
              <select
                {...register('severity', { required: true })}
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
                ></option>
                <option
                  value="warning"
                  selected
                  className="bg-background text-muted-foreground"
                >
                  Warning
                </option>
                <option
                  value="severe"
                  selected
                  className="bg-background text-muted-foreground"
                >
                  Severe
                </option>
              </select>
              {errors.severity && (
                <p className="form-message">{errors.severity.message}</p>
              )}
            </div>
            <div className="form-item">
              <label
                className={`form-item ${
                  errors.complaint && 'text-destructive'
                } form-label`}
              >
                Describe The Complaint
              </label>
              <textarea
                autoFocus
                disabled={isLoading}
                placeholder="complaint"
                type="text"
                {...register('complaint', { required: true })}
                className="textarea !px-2 !py-1"
              />
              {errors.complaint && (
                <p className=" form-message">{errors.complaint.message}</p>
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
                    Pls Confirm as this action is not reversible
                  </label>
                </div>

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
                    <span>Raise The Issue</span>
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

const AnnouncementDetailsSchema = z.object({
  announcement: z
    .string()
    .min(10, 'Announcement should be at least 10 characters long'),
  terms_check: z.boolean().refine((val) => val === true, {
    message: 'You must check the conditions below',
  }),
});

function EventForm({ apartment_name }) {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [error, setErrorMsg] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(AnnouncementDetailsSchema),
  });

  const onChange = (date, dateString) => {
    setDate(dateString);
  };

  const onSubmit = async (formdata) => {
    setLoading(true);
    setError(false);
    setErrorMsg('');

    const formData = {
      date: date,
      apartment_id: apartment_name,
      event: formdata.announcement,
    };
    try {
      const response = await axios.post(
        'http://localhost:5000/room-details/schedule-event',
        formData
      );

      if (response.status === 200) {
        alert('Success in creating the event');
        reset();
      }
    } catch (error) {
      if (error.response?.status === 500) {
        setError(true);
        setErrorMsg('Failed to schedule the event. Please try again.');
      } else if (error.response?.status === 404) {
        setError(true);
        setErrorMsg('Apartment not found.');
      } else {
        setError(true);
        setErrorMsg('Failed to schedule. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full min-h-[40vh]   items-start px-4 sm:justify-center border-none shadow-none font-content justify-start">
      <div className="card min-w-[40vw] w-full max-sm:w-96 p-6 border-none shadow-none max-h-inherit max-lg:px-0 flex flex-col items-center h-full justify-center gap-6">
        <div className="card-header flex items-center justify-center gap-2 flex-col"></div>
        <div className="card-content grid gap-y-1 w-full">
          <div className="text-red-600 card-title flex items-center justify-center text-nowrap max-sm:text-lg font-content !text-2xl">
            Annouce The Event
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-item">
              <label
                className={`${
                  errors.announcement && 'text-destructive'
                } form-label`}
              >
                Event title
              </label>
              <input
                placeholder="Event"
                type="text"
                {...register('announcement', { required: true })}
                className="input"
              />
              {errors.announcement && (
                <p className="form-message">{errors.announcement.message}</p>
              )}
            </div>

            <div className="form-item">
              <label
                className={`${
                  errors.event_date && 'text-destructive'
                } form-label`}
              >
                Event Date
              </label>
              <DatePicker onChange={onChange} />
            </div>

            <div className="items-top flex space-x-2">
              <div className="grid gap-1.5 leading-none">
                <div className="flex gap-2 items-center justify-left">
                  <input
                    type="checkbox"
                    {...register('terms_check', { required: true })}
                    className={`checkbox ${
                      errors.terms_check ? 'border-destructive' : ''
                    }`}
                  />
                  <label
                    htmlFor="terms_check"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Please Confirm, this action is not reversible
                  </label>
                </div>

                {errors.terms_check && (
                  <p className="form-message">{errors.terms_check.message}</p>
                )}
              </div>
            </div>

            {isError && <p className="form-message">{error}</p>}

            <div className="w-full grid place-items-center ">
              <button
                className="btn !text-lg max-sm:text-xs max-sm:px-2 max-sm:py-1 bg-slate-900 hover:bg-slate-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RiLoader5Line className="size-4 animate-spin" />
                ) : (
                  <>
                    <span>Schedule The Event</span>
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
export { RemoveUserDetails, EditUserRoles, RaiseTicketOnResident, EventForm };
