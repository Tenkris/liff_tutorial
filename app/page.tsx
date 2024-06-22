"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import liff from "@line/liff";
import axios from "axios";
export default function Home() {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
  const [profile, setProfile] = useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [text, setText] = useState("");

  const handleChange = (event: any) => {
    setText(event.target.value);
  };

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId });
      } catch (error) {
        if (error instanceof Error) {
          console.error("liff init error", error.message);
        } else {
          console.error("liff init error", error);
        }
      }
      if (!liff.isLoggedIn()) {
        liff.login();
        setIsLoggedIn(true);
      }
      const res = await liff.getProfile();
      console.log("profile", res);
      setProfile(res);
    };
    initLiff();
  }, [liffId]);
  const logout = () => {
    liff.logout();
    setIsLoggedIn(false);
    window.location.reload();
  };
  const handleSubmit = async () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/send-message";
    console.log("url", url);
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    try {
      const response = await axios.post(url, {
        userId: profile.userId,
        message: text,
      });
      console.log(response.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error("send messsage error", error.message);
      } else {
        console.error("send messsage error", error);
      }
    }
    setText("");
  };

  return (
    <>
      <div>
        <h1>LINE Front-end Framework </h1>
        <div className="flex flex-col justify-center items-center">
          <div>
            <p> display-name : {profile.displayName}</p>
            <p> userId : {profile.userId}</p>
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              width={100}
              height={100}
            />
          </div>
          <button onClick={logout} className=" bg-blue-400">
            Logout
          </button>
        </div>
      </div>
      <textarea className="bg-red-500" value={text} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
