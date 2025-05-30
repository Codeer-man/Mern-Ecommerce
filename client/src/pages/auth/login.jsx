import CommonForm from "@/components/common/form";
import OAuth from "@/components/oauth/Oauth";
import Oauth from "@/components/oauth/Oauth";
import { Button } from "@/components/ui/button";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/authslice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialstate = {
  username: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialstate);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Dispatching loginUser");
      const data = await dispatch(loginUser(formData)).unwrap();
      toast.success(data.message);

      const role = data.data.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/shop/home");
      }

      // setFormData(initialstate);
    } catch (err) {
      console.error("Login error", err);
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sing in to your account
        </h1>
        <p className="mt-2">
          Don't have a account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"sign in"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <OAuth />
    </div>
  );
}
