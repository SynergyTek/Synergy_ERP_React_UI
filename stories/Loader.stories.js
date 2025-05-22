import {Loader} from "~";

// More on how to set up src at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Core/Loader',
  component: Loader,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },

};

// More on writing src with args: https://storybook.js.org/docs/writing-stories/args
export const Indeterminate = {
  args: {
    primary: true,
    text: 'Button',
  },
};
