function CheckBox(props) {
	return (
		<label htmlFor={props.id}
		       className="flex cursor-pointer items-start gap-4">
			<div className="flex items-center">
				&#8203;
				<input
					type="checkbox"
					className="size-4 rounded border-gray-300"
					id={props.id}
				/>
			</div>
			{props.label ? (
				<div>
					<strong className="font-medium text-gray-900"> John Clapton </strong>
				</div>
			) : null}
		</label>
	);
}

export default CheckBox;