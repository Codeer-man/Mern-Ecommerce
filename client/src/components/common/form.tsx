import { SelectContent, SelectItem, SelectValue } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
// In your component file
import { FormComponentProps, FormControl } from "@/types/Form-types";

export default function Commonform({
  formControl,
  setFormData,
  onSubmit,
  buttonText,
  formData,
}) {
  const renderInputsByComponents = (getControlItems) => {
    let element = null;
    const value: string = getControlItems.value || "";

    switch (getControlItems.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItems.name}
            placeholder={getControlItems.placeholder}
            id={getControlItems.name}
            type={getControlItems.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItems.name]: event.target.value,
              })
            }
          />
        );
        break;
      case "select":
        element = element = (
          <Select
            value={value}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItems.name]: value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItems.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItems.options && getControlItems.length > 0
                ? getControlItems.map((options) => (
                    <SelectItem
                      key={options.id}
                      value={options.id}
                    ></SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItems.name}
            placeholder={getControlItems.placeholder}
            id={getControlItems.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItems.name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItems.name}
            placeholder={getControlItems.placeholder}
            id={getControlItems.name}
            type={getControlItems.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItems.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControl.map((controlItems) => (
          <div key={controlItems.name} className="grid w-full gap-1.5">
            <Label className="mb-1">{controlItems.label}</Label>
            {renderInputsByComponents(controlItems)}
          </div>
        ))}
      </div>
      <Button className="mt-2 w-full" type="submit">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
