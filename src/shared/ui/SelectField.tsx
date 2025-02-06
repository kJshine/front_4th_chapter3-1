import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface SelectFieldProps {
  label: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField = ({ label, value, options, onChange }: SelectFieldProps) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Select value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  </FormControl>
);
