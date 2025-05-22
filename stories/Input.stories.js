// Input.stories.jsx

import React from 'react';
import { Input } from '~/ui/input';
import {Textarea} from "~/ui/textarea";

export default {
  title: 'Components/Input',
  component: Input,
};

const Template = (args) => <Input {...args} />;
const TextareaTemplate = (args) => <Textarea {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'text',
  placeholder: 'Enter text...',
};

export const TextArea = TextareaTemplate.bind({});
TextArea.args = {
  placeholder: 'Type your message here.',
};

export const Email = Template.bind({});
Email.args = {
  type: 'email',
  placeholder: 'Enter email...',
};

export const Number = Template.bind({});
Number.args = {
  type: 'number',
  placeholder: 'Enter number...',
};

export const File = Template.bind({});
File.args = {
  type: 'file',
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'text',
  placeholder: 'Disabled input',
  disabled: true,
};