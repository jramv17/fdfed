import { MdAnnouncement } from 'react-icons/md';
import { RiLoader5Line } from 'react-icons/ri';
import { FaArrowLeftLong } from 'react-icons/fa6';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
function AnnouncementForm({
  setMessages,
  role,
  apartment_id,
  apartment_username,
}) {
  const [isForm, setIsForm] = useState(false);
  const [isFormLoading, setFormLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [file, setFile] = useState(null);

  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(false);

    const formData = new FormData();
    formData.append('announcement_msg', announcement);
    formData.append('apartment_id', apartment_id);
    formData.append('user_designation', role);
    formData.append('apartment_username', apartment_username);

    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/announcement/create',
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setMessages((prevMessages) => [response.data, ...prevMessages]);
        resetForm();
        setIsForm(false);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setErrorMsg('Failed to submit announcement');
      console.error('Error submitting announcement:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setAnnouncement('');
    setFile(null);
    setError(false);
    setErrorMsg('');
  };

  return !isForm ? (
    <div
      className="max-w-[70vw] mt-5 min-w-[70vw] h-[8vh] flex items-center justify-center bg-card cursor-pointer !shadow-2xl"
      onClick={() => setIsForm(true)}
    >
      <div className="text-xl w-full flex items-center justify-center gap-2">
        <MdAnnouncement size={35} />
        <span>Announce Something To Your Apartment</span>
      </div>
    </div>
  ) : (
    <div className="min-w-[70vw] p-6 card !shadow-2xl bg-white relative">
      <form className="space-y-6 mt-5" encType="multipart/form-data">
        <div className="form-item">
          <textarea
            autoFocus
            placeholder="Enter Your Announcement"
            value={announcement}
            onChange={handleAnnouncementChange}
            className={`textarea w-full h-16 px-4 py-2 border rounded-md focus:outline-none border-style border-b-[1px] ${
              isError ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {isError && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
        </div>

        <div className="form-item">
          <input
            type="file"
            onChange={handleFileChange}
            className="border rounded-md p-2"
          />
        </div>

        <div className="w-full flex justify-end items-center gap-5">
          <div
            className="btn text-lg py-2 cursor-pointer px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-md flex items-center justify-center"
            onClick={() => {
              setIsForm(false);
              resetForm();
            }}
          >
            Cancel
          </div>

          <button
            className="btn text-lg py-2 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-md flex items-center justify-center"
            disabled={isFormLoading}
            onClick={handleSubmit}
          >
            {isFormLoading ? (
              <RiLoader5Line className="animate-spin text-2xl" />
            ) : (
              'Announce It'
            )}
          </button>
        </div>
      </form>

      <span
        className="absolute top-0 right-2 p-2 pt-1 cursor-pointer"
        onClick={() => {
          setIsForm(false);
          resetForm();
        }}
      >
        <FaArrowLeftLong size={20} />
      </span>
    </div>
  );
}

function Announcement({ apartment_id, isRole, Role, apartment_username }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/announcement/${apartment_id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Could not fetch the messages:', error);
      }
    };

    if (apartment_id) {
      fetchMessages();
    }
  }, [apartment_id, messages]);

  const returnTime = (time) => {
    // const newtime=new Date(time).toLocaleTimeString();
    const newtime = new Date(time).toLocaleDateString();
    return newtime;
  };

  return (
    <div className="flex flex-col w-full gap-5 items-center justify-center p-6">
      {isRole && (
        <AnnouncementForm
          messages={messages}
          setMessages={setMessages}
          role={Role}
          apartment_id={apartment_id}
          apartment_username={apartment_username}
        />
      )}

      <div className="announcement-container">
        <div className="announcement-something">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={['DateRangeCalendar', 'DateRangeCalendar']}
            >
              <DemoItem>
                <DateRangeCalendar calendars={1} className="MuiCalendar" />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="announcement-messages-container">
          {messages.map((msg, index) => {
            return (
              <div key={index}>
                <div className="announcement-messages">
                  <div id="announcement-msg-header">
                    <strong>{msg.apartment_username}</strong>
                  </div>
                  <div id="announcement-msg-body">
                    {msg.announcement_msg}
                    <br />
                    {returnTime(msg.timestamp)}
                    <br />
                    {msg.fileUrl && (
                      <div id="fileupload">
                        <a
                          href={`http://localhost:5000/announcement/download/${msg.filename}`}
                          download={msg.filename}
                        >
                          {msg.filename}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Announcement;
