import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faExclamationTriangle, faInfoCircle} from "@awesome.me/kit-9b926a9ec0/icons/classic/light";

export const iconTypeMap = {
	success: faCheckCircle,
	danger: faExclamationTriangle,
	info: faInfoCircle,
};

function Notification({ heading, text, type = "info" }) {
	return (
		<div
			role="alert"
			className={`my-2 shadow-md rounded border-s-4 border-${type}-700 bg-${type}-100 p-4 dark:border-${type}-800 dark:bg-${type}-800 dark:bg-opacity-30`}
		>
			<div
				className={`flex items-center gap-2 text-${type}-800 dark:text-${type}-300`}
			>
				<FontAwesomeIcon icon={iconTypeMap[type]} className={"size-3.5"} />
				<p className="block font-bold text-inherit text-sm"> {heading} </p>
			</div>
			
			<p className={`mt-2 text-xs text-${type}-700 dark:text-${type}-200`}>
				{text}
			</p>
		</div>
	);
}

export default Notification;