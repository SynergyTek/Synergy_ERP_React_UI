import DatePicker ,{ DatePickerWithRange } from "~/ui/date-picker";
import React from "react";
import {date} from "zod";

export default {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'centered',
    },
};

const Template = (args) => <DatePicker {...args} />;
const RangeTemplate = (args) => <DatePickerWithRange {...args} />;

export const Default = Template.bind({});
Default.args = {
    className: 'w-full'
};

export const DateRange = RangeTemplate.bind({});
DateRange.args = {
    // Add range args here if needed
};
export const Data = {
    args: {
        source: "https://jsonplaceholder.typicode.com/posts",
        columns: [
            {header: "User Id", field: "id"},
            {header: "Title", field: "title"},
        ]
    },
};
