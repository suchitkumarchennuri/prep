import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

const FormFieldComponent = ({
  control,
  name,
  label,
  placeholder,
}: FormFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default FormFieldComponent;
