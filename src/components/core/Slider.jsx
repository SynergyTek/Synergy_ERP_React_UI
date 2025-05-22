import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFiles} from "@awesome.me/kit-9b926a9ec0/icons/classic/regular";
import {faFolders} from "@awesome.me/kit-9b926a9ec0/icons/classic/solid";
import {Icon} from "~";
import {Button} from "~/ui/button";

function Slider({icons, min = 0, max = 100, value = 50, setValue, ...props}) {
	const [val, setVal] = useState(value);
	icons = icons || {
		min: "minus",
		max: "plus"
	}
	const handleChange = (e) => {
		if (typeof setValue === "function") {
			setValue(e.target.value);
		}
		setVal(e.target.value);
	};
	useEffect(() => {
		setValue(val);
	}, [val]);
	return (
		<div className={"flex items-center gap-2 text-primary-900 dark:text-primary-300  dark:text-opacity-60"}>
			<Button icon={icons.min}
			        size={"xs"}
			        variant={"tertiary"}
			        onClick={() => {
				        setVal(Math.max(min, val - 1));
				        
			        }} />
			<input type={"range"}
			       min={min}
			       max={max}
			       value={val}
			       onChange={handleChange}
			       className={"w-1/2"} />
			<Button icon={icons.max}
			        size={"sm"}
			        variant={"tertiary"}
			        onClick={() => {
				        setVal(Math.min(max, val + 1));
				        
			        }} />
		</div>
	);
}

export default Slider;