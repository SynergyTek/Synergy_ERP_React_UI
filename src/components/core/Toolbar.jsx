import {Button} from "~";
import {faPlusCircle} from "@awesome.me/kit-9b926a9ec0/icons/classic/light";
import {faPlus} from "@awesome.me/kit-9b926a9ec0/icons/classic/regular";

function Toolbar(props){
	return <div className={"bg-primary-200 dark:bg-secondary-900 p-4"}>
		<Button icon={faPlus} mode={"tertiary"} size={"sm"}/>
	</div>
}

export default Toolbar