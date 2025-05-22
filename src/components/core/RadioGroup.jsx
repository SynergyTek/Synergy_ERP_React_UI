function RadioGroup({label, options, name, required}) {
	return (
		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
				{label}
				{required && <span className="text-red-500"> *</span>}
			</label>
			<div className="mt-2">
				{options.map((option) => (
					<div key={option.value}
					     className="flex items-center mb-2">
						<input
							type="radio"
							id={`${name}-${option.value}`}
							name={name}
							value={option.value}
							className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
						/>
						<label htmlFor={`${name}-${option.value}`}
						       className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
							{option.label}
						</label>
					</div>
				))}
			</div>
		</div>
	);
}

export default RadioGroup;