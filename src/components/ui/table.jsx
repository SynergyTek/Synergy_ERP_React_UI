import {CheckBox, ContextMenu, Dropdown, Icon, InputField, Loader, Pagination, Select, Template, Text} from "~";
import React, {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "~/ui/resizable";
import {Button} from "~/ui/button";
import {Input} from "~/ui/input";
import {flattenObject, type} from "@/lib/utils";
import {cmHandler, ContextMenuTrigger} from "~/core/ContextMenu";
import PropTypes from "prop-types";

const columnWidthMap = {
	1: "w-1/12",
	2: "w-2/12",
	3: "w-3/12",
	4: "w-4/12",
	5: "w-5/12",
	
	
}

function Toolbar({
	                 onSearch,
	                 columns,
	                 onFilter,
	                 onRefresh,
	                 onExport,
	                 onPrint,
	                 onAdd,
	                 onEdit,
	                 onDelete,
	                 onSettings,
	                 ...props
                 }) {
	const [selection, setSelection] = useState(false);
	const handleExport = (selected) => {
		console.log(selected, " selected");
		onExport(selected);
	}
	const [fInput, setFInput] = useState("");
	const [fSelect, SetFSelect] = useState(null)
	useEffect(() => {
		if (fInput || fSelect) {
			console.log(fInput, fSelect)
			onFilter && onFilter(fInput, fSelect);
		}
	}, [fInput, fSelect]);
	
	return (
		<div
			className={"flex gap-2 p-4 items-center bg-primary-900 shadow-md text-primary-100 dark:bg-secondary-800 dark:text-primary-300"}
		>
			{selection ? (
				
				<Button
					icon={"close"}
					onClick={() => {
						setSelection(false);
					}}
				></Button>) : null}
			{columns?.length > 0 ? < >
				<Select
					source={columns}
					map={{"key": "field", "value": "header"}}
					size={"sm"}
					defaultValue={"1"}
					onSelect={(selection) => {
						SetFSelect(selection)
					}}
					unselectedText={"All"}
				/>
				<Input
					type="text"
					placeholder="Search Here"
					required={false}
					id="Search-filter"
					className={"w-48 rounded bg-transparent text-sm h-8 p-2 px-2"}
					onChange={(event) => {
						console.log(event.currentTarget.value)
						setFInput(event.currentTarget.value)
					}}
				/>
				
				
				<Dropdown source={[
					{id: "excel", name: "Excel", icon: "file-excel"},
					{id: "word", name: "Word", icon: "file-word"},
					{id: "pdf", name: "PDF", icon: "file-pdf"},
				
				]}
				          onSelect={handleExport}
				>
					<Button size={"sm"}
					        icon={"download"}
					        variant={"outline"}></Button>
				</Dropdown>
			</> : null}
		</div>
	)
}

function Header({context, index, onClick, onContextMenu, sort, ...props}) {
	const directions = ["none", "asc", "desc"]
	return <div
		className={`min-h-12 items-center flex ${directions[sort?.direction] === "asc" ? "flex-col" : "flex-col-reverse"} justify-center bg-primary-300/70 text-primary-950 dark:text-primary-50 dark:bg-secondary-900 dark:border-gray-700 hover:text-primary-50 hover:bg-primary-500/80 dark:hover:bg-gray-600 transition-all
	 ease-linear cursor-pointer`}
		onClick={() => {
			onClick && onClick({column: context, direction: (sort.direction + 1) % 3});
		}}
		onContextMenu={onContextMenu}
	><Text
		selectable={false}
		color={"inherit"}
		size={"xs"}
		className={`font-bold uppercase ${props.resizable ? "pl-4" : "px-4"} w-full ${props.resizable && !props.isFirst && "border-l"} ${props.resizable && !props.isLast && "border-r"} border-primary-400 dark:border-primary-300/30`}>{context.header}</Text>
		{sort?.column === context && directions[sort.direction] !== "none" &&
			<Icon icon={directions[sort.direction] === "asc" ? "chevron-down" : "chevron-up"}
			      size={"sm"}></Icon>}
	</div>
}

function Cell({data, context, onClick, onContextMenu, ...props}) {
	context.template && console.log(data, context)
	return <div
		className={`h-12 border-b text-primary-950 dark:text-primary-100 px-4 p-2 dark:border-secondary-800 [&.hover]:text-primary-50 [&.hover]:bg-primary-500 dark:[&.hover]:bg-primary-800/60 data-[row-hover]:bg-primary-400/50 dark:data-[row-hover]:bg-primary-800/40 transition-all
	 ease-linear cursor-pointer overflow-clip items-center flex`}
		onClick={onClick}
		onMouseEnter={props.onHover}
		onMouseLeave={props.onHover}
		onContextMenu={onContextMenu}
		data-index={props.index}
	>
		{data &&
		context.template ? (<Template context={data[context.field]}>{context.template}</Template>) : (
			<Text truncate={true}
			      color={"inherit"}
			      wrap={false}>{flattenObject(data)[context.field]}</Text>
		
		)}
	
	
	</div>
}


function Table({
	               source,
	               columns = ["Id", "Name"],
	               pageLimit = 10,
	               actions,
	               pagination = true,
	               resizable = true,
	               sortable = true,
	               toolbar = true,
	               ...props
               }) {
	const [allData, setAllData] = useState([]);
	const [data, setData] = useState(null);
	const [sortedData, setSortedData] = useState(null);
	const [filteredData, setFilteredData] = useState(null);
	const [sort, setSort] = useState({column: null, direction: 0});
	const [fetchedColumns, setFetchedColumns] = useState(columns);
	const [pageData, setPageData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [selection, setSelection] = useState(false);
	const PanelGroupType = resizable ? ResizablePanelGroup : "div";
	
	useEffect(() => {
		
		if (!source || !columns) {
			setData(null);
			setFetchedColumns(null);
			setAllData([]);
			setLoading(false);
			return;
		}
		if (type(source) === "function") {
			let _data = source()
			setData(_data)
			setLoading(false)
		}
		if (type(source) === "asyncfunction") {
			source().then((res) => {
				setData(res)
				setLoading(false)
			})
		}
		if (typeof columns === "function") {
			columns().then((res) => {
				setFetchedColumns(res);
				setLoading(false);
			});
		}
		if (Array.isArray(source)) {
			source.length ? setData(source) : setData(null);
			setLoading(false);
		}
		if (typeof source === "string") {
			axios
				.get(source)
				.then((res) => {
					if (Array.isArray(res.data)) {
						setData(res.data);
						setLoading(false);
					}
				})
				.catch((e) => {
					setData(null);
					console.log(e);
				});
			
			// if (columns.length > 0) {
			// 	const cols = columns.map((item) => {
			// 		const tempObj = {
			// 			display: item.header,
			// 			value: item.field,
			// 		};
			// 		return tempObj;
			// 	});
			// 	const tempData = {...colFilter};
			// 	tempData.data = [...cols];
			// 	selColFilter(tempData);
			// }
		}
	}, []);
	
	useEffect(() => {
		const pageableData = filteredData || sortedData || data
		if (Array.isArray(pageableData) && pageableData.length) {
			let _data = [],
				lowerLimit = (currentPage - 1) * pageLimit,
				upperLimit = pagination ? Math.min(
					pageableData.length,
					pageLimit + (currentPage - 1) * pageLimit
				) : pageableData.length;
			for (let i = lowerLimit; i < upperLimit; i++) {
				if (pageableData[i]) {
					_data.push(pageableData[i]);
				}
			}
			setPageData(_data);
		}
		
	}, [data, currentPage, sortedData, filteredData]);
	
	
	const selectRow = (event) => {
		setSelection(true);
	};
	const handleFilter = (inputText, selected) => {
		
		if (!data || !data.length) {
			return;
		}
		const newFilteredData = [];
		
		data.forEach((item) => {
			item = flattenObject(item);
			inputText = inputText.toString();
			if (selected) {
				
				if (
					item[selected.field] &&
					item[selected.field]
						.toLowerCase()
						.includes(inputText.toString().toLowerCase())
				) {
					newFilteredData.push(item);
				}
			} else {
				let found = false;
				Object.keys(item).forEach((key) => {

					if (item[key] &&
						item[key]
							.toString()
							.toLowerCase()
							.includes(inputText.toString().toLowerCase())
					) {
						found = true;
					}
				});
				if (found) {
					newFilteredData.push(item);
				}
			}
			
		});
		console.log(newFilteredData)
		if (Array.isArray(newFilteredData)) {
			setFilteredData(newFilteredData);
		} else {
			setFilteredData(null);
		}
	};
	
	const getRowSiblings = (element) => {
		const siblings = [];
		const table = element.parentElement.parentElement
		const elementIndex = element.dataset.index;
		table.querySelectorAll("[data-panel]").forEach((panel) => {
			Array.from(panel.children).forEach((child) => {
				child.removeAttribute("data-row-hover")
				if (elementIndex === child.dataset.index && child !== element) siblings.push(child)
			})
		})
		return siblings;
	};
	const handleRowHover = (event) => {
		
		getRowSiblings(event.currentTarget)
		switch (event.type) {
			case "mouseleave":
				event.currentTarget.classList.remove("hover");
				getRowSiblings(event.currentTarget).forEach((sibling) => {
					sibling.removeAttribute("data-row-hover")
				})
				break;
			case "mouseenter":
				event.currentTarget.classList.add("hover");
				getRowSiblings(event.currentTarget).forEach((sibling) => {
					sibling.dataset.rowHover = true
				})
				break;
		}
		
	}
	
	useEffect(() => {
		if (sort?.column && data) {
			if (sort.direction === 0) {
				setSortedData(null)
				return
			}
			const direction = sort.direction
			const field = sort.column.field
			let _sortedData = Array.from(data).sort((a, b) => {
				const flata = flattenObject(a)
				const flatb = flattenObject(b)
				if (flata[field] < flatb[field]) {
					return direction === 2 ? 1 : -1;
				}
				if (flata[field] > flatb[field]) {
					return direction === 1 ? 1 : -1;
				}
				return 0;
			});
			setSortedData(_sortedData);
		}
	}, [sort]);
	return (
		<div
			id={"table-wrapper"}
			className={
				"rounded-md overflow-clip flex flex-col border border-primary-900/30 dark:border-secondary-800"
			}
		>
			
			{
				toolbar &&
				<div className="overflow-x-auto shadow-md ">
					<Toolbar columns={columns}
					         setSelection={setSelection}
					         onFilter={handleFilter}
					></Toolbar>
				</div>
			}
			<div className={""}>
				{loading ? (
					<div
						className="p-6 text-center select-none cursor-pointer"
					>
						<div className={"w-full flex items-center justify-center"}>
							<Loader></Loader>
						</div>
					</div>
				
				) : pageData ? (
						<PanelGroupType direction={"horizontal"}
						                className={`w-full ${!resizable && "flex overflow-x-scroll"}`}>
							
							
							{columns.map((column, colIndex) => {
								const PanelType = resizable ? ResizablePanel : "div";
								return (
									<>
										<PanelType minSize={8}
										           onResize={(size) => {
											           if (size <= 12) {
												           console.log("small")
											           }
										           }}
										           className={`w-full ${column.width && columnWidthMap[column.width]}`}
										>
											<Header context={column}
											        index={colIndex}
											        onClick={setSort}
											        sort={sort}
											        resizable={resizable}
											        isFirst={colIndex === 0}
											        isLast={colIndex === columns.length - 1} />
											{pageData ? pageData.map((r, rIndex) => {
												return <ContextMenuTrigger options={actions}
												                           context={r}>
													<Cell data={r}
													      key={rIndex}
													      context={column}
													      onClick={selectRow}
													      onHover={handleRowHover}
													      index={rIndex}
													      {...props}></Cell></ContextMenuTrigger>
											}) : <Loader />}
										
										</PanelType>
										{colIndex !== columns.length - 1 && resizable &&
											<ResizableHandle className={"transition-all w-0 bg-transparent hover:bg-primary-300/20"} />}
									</>
								);
							})}
						
						</PanelGroupType>
					)
					: (
						
						<div
							className="p-6 text-center select-none cursor-pointer"
							onClick={refresh}
						>
							<p className={"text-lg font-bold"}>No data found</p>
						</div>
					
					)}
			</div>
			{pagination && (data || pageData) && (
				<nav
					className={
						"w-full border-t border-primary-200/40 flex items-center justify-between p-4"
					}
				>
					<Text size={"sm"}
					      color={"primary"}>
						Showing{" "}
						<span className={"font-bold"}>
							{pageLimit * (currentPage - 1)}
							{" - "}
							{pageLimit + pageLimit * (currentPage - 1)}
						</span>{" "}
						out of <span className={"font-bold"}>{data?.length}</span>
					</Text>
					{data && data.length ? (
						<Pagination
							pages={Math.ceil(data.length / pageLimit)}
							onChange={setCurrentPage}
						/>
					) : (
						<Loader />
					)}
				</nav>
			)}
		</div>
	);
}

Table.propTypes = {
	/**
	 * The source of the data. Can be a string (URL), an array, or a function.
	 *
	 */
	source: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.func]),
	
	/**
	 * The columns configuration for the table. Can be an array or a function.
	 * @type {array|function}
	 */
	columns: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
	
	/**
	 * The number of items to display per page.
	 * @type {number}
	 */
	pageLimit: PropTypes.number,
	
	/**
	 * The actions available for each row in the table.
	 * @type {array}
	 */
	actions: PropTypes.array,
	
	/**
	 * Whether to enable pagination.
	 * @type {boolean}
	 */
	pagination: PropTypes.bool,
	
	/**
	 * Whether the table columns are resizable.
	 * @type {boolean}
	 */
	resizable: PropTypes.bool,
	
	/**
	 * Whether the table columns are sortable.
	 * @type {boolean}
	 */
	sortable: PropTypes.bool,
};
export default Table;
