import React, { useEffect, useRef, useState } from "react";
import email from "@/assets/email.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // assuming you use this

export default function VerifyEmail() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [disButton, setDisButton] = useState(true);
  const [timer, setTimer] = useState(30);
  const intervelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (disButton && timer > 0 && !intervelRef.current) {
      intervelRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(intervelRef.current);
            intervelRef.current = null;
            setDisButton(false);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervelRef.current);
      intervelRef.current = null;
    };
  }, [disButton, timer]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/check/verification/code/${user._id}`,
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Email verified");
        navigate(-1);
        return;
      }
      toast.error("Invalid code");
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/send/verification/${user._id}`
      );
      toast.success("Verification code resent!");
      setDisButton(true);
      setTimer((prev) => prev + 10);
    } catch (error) {
      toast.error("Failed to resend code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-[80vh] mt-10 grid place-items-center">
      <img src={email} alt="email" height={200} width={200} />
      <h2 className="text-2xl font-semibold mb-4 text-center">
        We have sent a verification code to {user.email}
      </h2>
      <form onSubmit={onSubmit} className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Enter Verification Code to Continue
        </h2>

        <input
          type="number"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          placeholder="Enter 6-digit code"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-semibold rounded-md mb-4 transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        <button
          type="button"
          onClick={resendCode}
          disabled={disButton || loading}
          className={`w-full py-2 text-white font-semibold rounded-md transition disabled:cursor-not-allowed ${
            disButton || loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {disButton ? `Resend in ${timer}s` : "Resend Code"}
        </button>
      </form>
    </div>
  );
}
