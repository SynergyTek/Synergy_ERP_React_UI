import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@awesome.me/kit-9b926a9ec0/icons/classic/regular";

function DataGridComponent({component, renderComponent}) {
	const [rows, setRows] = useState([{DegreeName: '', Percentage: ''}]);
	
	const addRow = () => {
		setRows([...rows, {DegreeName: '', Percentage: ''}]);
	};
	
	const removeRow = (id) => {
		const elem = document.getElementById(id);
		elem.remove();
	};
	
	return (
		<div key={component.key}>
			<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
				{component.label}
			</label>
			<div className="relative overflow-x-auto">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead
						className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						{component.components.map((comp) => (
							comp.key !== 'ParentId' && comp.key !== 'Id' && (
								<th key={comp.key}
								    className="px-2 py-3">
									{comp.label}
								</th>
							)
						))}
						<th className="px-1 py-3 w-36">Actions</th>
					</tr>
					</thead>
					<tbody>
					{rows.map((row, rowIndex) => (
						<tr key={rowIndex}
						    id={`row-index-${rowIndex}`}
						    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							{component.components.map((comp) => (
								comp.key !== 'ParentId' && comp.key !== 'Id' && (
									<td key={comp.key}
									    className="px-2 pt-3">
										{renderComponent(comp)}
									</td>
								)
							))}
							<td className="px-2 pt-0">
								<button
									type="button"
									onClick={() => removeRow(`row-index-${rowIndex}`)}
									className="flex justify-center items-center shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none rounded p-3 mb-1 gap-2"
								>
									<FontAwesomeIcon className={'w-3'}
									                 icon={faTrash} />
								</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
				<button
					type="button"
					onClick={addRow}
					className="flex justify-center items-center shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none rounded px-3 py-2 mb-7 mt-2 gap-2"
				>
					<FontAwesomeIcon className={'w-4'}
					                 icon={faPlus} /><span>Add</span>
				</button>
			</div>
		</div>
	);
}


export default DataGridComponent;