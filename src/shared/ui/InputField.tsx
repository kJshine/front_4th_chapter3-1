import { FormControl, FormLabel, Input } from '@chakra-ui/react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string | number | undefined;
  placeholder?: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

export const InputField = ({
  label,
  value,
  placeholder,
  onChange,
  type,
  min,
  max,
}: InputFieldProps) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
      />
    </FormControl>
  );
};
