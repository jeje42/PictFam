import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { TextField } from '@material-ui/core';

type Props = FieldRenderProps<string, any>;

const TextInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => {
  return <TextField {...input} {...rest} />;
};

export default TextInput;
