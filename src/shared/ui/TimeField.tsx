import { FormControl, FormLabel, Tooltip, Input } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface TimeFieldProps {
  label: string;
  value: string;
  error: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

export const TimeField = ({ label, value, error, onChange, onBlur }: TimeFieldProps) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    <Tooltip label={error} isOpen={!!error} placement="top">
      <Input type="time" value={value} onChange={onChange} onBlur={onBlur} isInvalid={!!error} />
    </Tooltip>
  </FormControl>
);
