import { useRef, useState } from "react";
import { Button } from "~";

function InputField({
	id,
	label,
	type,
	placeholder = "",
	required = false,
	button,
	addon,
	...props
}) {
	const [error, setError] = useState(null);
	const inputRef = useRef();
	const inputClass = ` w-full invalid:text-red-500 group-hover:text-primary-800 dark:group-hover:text-primary-200 text-primary-600 dark:text-secondary-300 focus:text-primary-800 dark:focus:text-primary-200 peer rounded border-none bg-inherit p-3 ${placeholder === "" ? "placeholder-transparent" : "placeholder-primary-300 placeholder-opacity-60 placeholder-text-sm"} focus:border-transparent focus:outline-none focus:ring-0 transition-all duration-300`;
	const validateInput = () => {
		if (inputRef.current.validity.valid) {
			return setError(null);
		}
		setError(inputRef.current.validationMessage);
	};
	const handleSubmit = () => {
		if (button.submit) {
			if (!inputRef.current.validity.valid) {
				setError(inputRef.current.validationMessage);
				return;
			}
			button.submit(inputRef.current.value);
		}
	};
	return (
		<div id={"input"} className={`flex gap-4 w-full ${props.className}`}>
			<div className={`flex w-full gap-2 ${error ? "mb-4" : ""}`}>
				<div
					className={
						"group relative block rounded border border-primary-400 dark:border-secondary-700 bg-primary-50 shadow-sm hover:border-primary-600 dark:hover:border-primary-400 focus-within:border-primary-600 dark:focus-within:border-primary-400 focus-within:ring-0 dark:bg-gray-950 transition-all duration-300 w-full"
					}
				>
					{type === "textarea" ? (
						<textarea
							id={id}
							name={id}
							className={inputClass}
							required={required}
							placeholder={placeholder}
							ref={inputRef}
							onChange={() => {
								props.onChange ? props.onChange(inputRef.current.value) : null;
								validateInput();
							}}
							onBlur={() => {
								props.onBlur && props.onBlur();
							}}
						></textarea>
					) : (
						<input
							type={type}
							id={id}
							name={id}
							className={inputClass}
							required={required}
							ref={inputRef}
							placeholder={placeholder}
							pattern={props.pattern}
							value={props.value}
							onChange={() => {
								props.onChange ? props.onChange(inputRef.current.value) : null;
								validateInput();
							}}
							onBlur={() => {
								props.onBlur && props.onBlur();
							}}
						/>
					)}

					{label ? (
						<label
							htmlFor={id}
							className={
								"group-hover:text-primary-600 dark:group-hover:text-primary-400 text-primary-400 dark:text-secondary-500 pointer-events-none absolute start-1.5 top-0 -translate-y-1/2 bg-inherit p-1.5 text-xs peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600  peer-focus:dark:text-primary-400 transition-all duration-100 "
							}
						>
							{label}
						</label>
					) : null}
					<span className={`flex gap-2 absolute ${error ? "p-2" : null}`}>
						<p className={`text-red-500 text-xs`}>{error}</p>
					</span>
				</div>
				{addon &&
					addon.right &&
					addon.right.map((item, index) => {
						return (
							<Button
								key={index}
								mode={"tertiary"}
								icon={item.icon}
								onClick={item.onClick}
							></Button>
						);
					})}
			</div>
			{button ? <Button {...button} onClick={handleSubmit}></Button> : null}
		</div>
	);
}

export default InputField;
