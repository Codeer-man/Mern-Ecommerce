import Commonform from "@/components/common/form";
import { registerFormControls } from "@/config";
import { RegisterData } from "@/types/types";
import React, { FormEventHandler, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState<RegisterData> ({
    username: "",
    email: "",
    password: "",
  });

  function onSubmit (e:React.FormEvent<FormEventHandler>):void {
    e.preventDefault()
    try {
      
    } catch (error) {
      
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p>
          Already Have a account{" "}
          <Link
            to="/auth/login"
            className="font-medium ml-2 text-primary hover:underline"
          >
            Login{" "}
          </Link>{" "}
        </p>
        <div>
          <Commonform
            formControl={registerFormControls}
            buttonText={"Sign up"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
        </div>
        
      </div>
    </div>
  );
}
