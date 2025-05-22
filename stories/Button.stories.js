import {fn} from '@storybook/test';
import {Button} from '~';
import {faHome} from "@awesome.me/kit-9b926a9ec0/icons/classic/regular";

// More on how to set up src at: https://storybook.js.org/docs/writing-stories#default-export
export default {
	title: 'Core/Button',
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info:
		// https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	
	
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
	// https://storybook.js.org/docs/essentials/actions#action-args
	args: {onClick: fn()},
};

// More on writing src with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
	args: {
		primary: true,
		text: 'Button',
	},
};

export const Secondary = {
	args: {
		text: 'Button',
	},
};

export const Tiny = {
	args: {
		primary: true,
		size: 'xs',
		text: 'Button',
	},
};export const Small = {
	args: {
		primary: true,
		size: 'sm',
		text: 'Button',
	},
};
export const Large = {
	args: {
		primary: true,
		size: 'md',
		text: 'Button',
	},
};
export const Huge = {
	args: {
		primary: true,
		size: 'lg',
		text: 'Button',
	},
};

export const Icon = {
    args: {
        primary: true,
        icon: faHome
    }
};

