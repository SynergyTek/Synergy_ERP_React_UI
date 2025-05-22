import React, { useEffect, useRef, useState } from 'react'
import { Button } from '~/ui/button'
import { Input } from '~/ui/input'

export default function ChatInput({ onSendMessage, messagesLength }) {
    const [input, setInput] = useState('')
    const inputRef = useRef(null)
    const sendRef = useRef(null)
    const sendMessage = () => {
        onSendMessage(input)
        console.log(<input type="text" />)
        setInput('')
        inputRef.current.focus()
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                if (inputRef.current && inputRef.current.value.trim()) {
                    sendRef.current?.click()
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown, true)
        return () => {
            document.removeEventListener('keydown', handleKeyDown, true)
        }
    }, [])

    return (
        <div className="flex w-full flex-col items-center justify-center p-4 pt-2">
            {messagesLength === 0 && (
                <p className="mb-4 text-center text-2xl font-medium text-gray-600 dark:text-gray-300">
                    What can I help with?
                </p>
            )}

            <div className="flex w-full max-w-4xl justify-center">
                <div className="relative w-full">
                    <Input
                        ref={inputRef}
                        type="text"
                        className={`${messagesLength === 0 ? 'h-20 text-lg' : 'h-12'} rounded-xl pl-6 pr-12 shadow-md transition-all duration-200 dark:bg-slate-900`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    ></Input>
                    {/*<Button icon={"microphone"}></Button>*/}
                    <Button
                        icon={'paper-plane'}
                        ref={sendRef}
                        onClick={sendMessage}
                        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-md bg-primary-600 p-0 text-white shadow-sm hover:bg-primary-700"
                    ></Button>
                </div>
            </div>
        </div>
    )
}
