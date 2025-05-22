import ChatBubble from '../src/components/chat/ChatBubble'
import { toast } from 'sonner'

const meta = {
    title: 'Chat/ChatBubble',
    component: ChatBubble,
}

export default meta

export const User = {
    args: {
        role: 'user',
        content: 'Hello World',
    },
}

export const Bot = {
    args: {
        role: 'bot',
        content: 'Hello World',
    },
}
export const UserWithContent = {
    args: {
        role: 'user',
        content: {
            text: 'Hello World',
            action: 'VIEW',
        },
    },
}
export const Buttons = {
    args: {
        role: 'bot',
        content: {
            text: 'These are some sample buttons. Click one to send a payload',
            buttons: [
                { title: 'Button 1', payload: '/button_payload_1' },
                { title: 'Button 2', payload: '/button_payload_2' },
                { title: 'Button 3', payload: '/button_payload_3' },
                { title: 'Button 4', payload: '/button_payload_4' },
                { title: 'Button 5', payload: '/button_payload_5' },
            ],
            action: 'SELECT',
        },
        onSelect: (payload) => {
            toast(`Clicked button with payload "${payload}"`)
        },
    },
}
export const Chart = {
    args: {
        role: 'bot',
        content: {
            text: JSON.stringify({
                person: 'John, Doe, Smith, Jane, Doe, Smith, John, Karan, Kumar, Pilot',
                org: 'Google, Microsoft, Apple, Amazon, Facebook, Netflix,Google, Microsoft, Netflix, Sony, Toshiba',
                loc: 'New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, New York, Delhi, Agra, Mumbai, Bangalore',
            }),
            action: 'CHART',
        },
    },
}
export const Compare = {
    args: {
        role: 'bot',
        content: {
            text: 'Here are the differences between the two documents',
            json: {
                diff_count: 3,
                differences: [
                    {
                        type: 'insert',
                        original_lines: [],
                        updated_lines: [
                            'SYMBIOSIS INTERNATIONAL (DEEMED UNIVERSITY)',
                        ],
                        line_numbers: {
                            original_range: [6, 5],
                            updated_range: [6, 6],
                        },
                    },
                    {
                        type: 'replace',
                        original_lines: ['Chancellor  uuuuChancellor'],
                        updated_lines: ['Chancellor Chancellor'],
                        line_numbers: {
                            original_range: [13, 13],
                            updated_range: [14, 14],
                        },
                    },
                    {
                        type: 'replace',
                        original_lines: [
                            'Lavale Hill Base, SUHRC Building 4th floor, Pune 412 115 Maharashtra, India. Tel: +91-20-66975075 Email: info@ssodl.edu.in Web: www-ssodl.edu.inpp',
                        ],
                        updated_lines: [
                            'Lavale Hill Base, SUHRC Building 4th floor, Pune 412 115 Maharashtra, India. Tel: +91-20-66975075 Email: info@ssodl.edu.in Web: www-ssodl.edu.in',
                        ],
                        line_numbers: {
                            original_range: [15, 15],
                            updated_range: [16, 16],
                        },
                    },
                ],
            },
            action: 'COMPARE',
        },
    },
}

export const CompareNone = {
    args: {
        role: 'bot',
        content: {
            text: 'Here are the differences between the two documents',

            json: {
                diff_count: 0,
            },

            action: 'COMPARE',
        },
    },
}
