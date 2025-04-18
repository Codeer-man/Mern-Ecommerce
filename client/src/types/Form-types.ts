export interface Option {
  id: string;
  label: string;
}

export type ComponentType = "input" | "select" | "textarea";

export interface BaseFormControl {
  label: string;
  name: string;
  placeholder?: string;
  componentType: ComponentType;
  value?: string;
  id?: string;
}

export interface InputControl extends BaseFormControl {
  componentType: "input";
  type: "text" | "email" | "password" | "number";
}

export interface TextareaControl extends BaseFormControl {
  componentType: "textarea";
}

export interface SelectControl extends BaseFormControl {
  componentType: "select";
  options: Option[];
}

export type FormControl = InputControl | TextareaControl | SelectControl;

export interface FormComponentProps {
  formControl: FormControl[];
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  buttonText: string;
  formData: Record<string, string>;
}
