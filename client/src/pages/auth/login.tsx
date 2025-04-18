import Commonform from "@/components/common/form";
import { loginFormControls } from "@/config";
import { LoginData } from "@/types/types";
import React, { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  function onSubmit(e: React.FormEvent<FormEventHandler>): void {
    e.preventDefault();
    try {
    } catch (error) {}
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <Commonform
        formControl={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}
