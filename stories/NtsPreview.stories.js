import NtsPreview from "~/core/NtsPreview";
import {toast} from "sonner";

// More on how to set up src at: https://storybook.js.org/docs/writing-stories#default-export
export default {
	title: 'Data/Nts Preview', component: NtsPreview,
	
};

// More on writing src with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
	args: {
		source: {
			NtsType: "Note",
			Id: "5bd1679c-8f75-4e44-8e88-b3a0ee073825",
			TemplateCode: "GENERAL_DOCUMENT"
		},
		title: "NoteSubject",
		onClose:
			() => {
				toast("Closed")
			}
	},
};
