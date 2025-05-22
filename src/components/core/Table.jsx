import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeMaterial } from 'ag-grid-community';
import { dmsApi } from '@/../client';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Dropdown from '@/components/core/Dropdown';
import {Icon} from '~';

const Table = ({ columnDefs, rowData, source, gridOptions = {}, actions = [] }) => {
	const [data, setRowData] = useState(rowData);
	const [loading, setLoading] = useState(true);

	const enhancedColumnDefs = React.useMemo(() => {
		console.log("url"+source);
		if (actions && actions.length > 0) {
			return [
				...columnDefs,
				{
					headerName: 'Actions',
					field: 'actions',
					sortable: false,
					filter: false,
					width: 100,
					cellRenderer: (params) => {
						const actionsWithData = actions.map(action => ({
							...action,
							onClick: () => action.onClick(params.data)
						}));
						
						return (
							<Dropdown
								source={actionsWithData}
								map={{ key: "label", value: "label" }}
							>
								<button>
									<Icon icon="ellipsis-vertical" />
								</button>
							</Dropdown>
						);
					}
				}
			];
		}
		return columnDefs;
	}, [columnDefs, actions]);

	const handleSearch = async(e) => {
		try {
			if (e.target.value === '') {
				if (source) {
					const url = new URL(source, window.location.origin);
					if (!url.searchParams.has('portalName')) {
						url.searchParams.append('portalName', 'DMS');
					}
					const response = await dmsApi.get(url.pathname + url.search);
					setRowData(response.data);
				}
			} else {
				const input = e.target.value.toLowerCase();
				const fields = columnDefs.map(col => col.field);
				const filtered = data.filter(row =>
					fields.some(field => {
						const value = row[field];
						return value?.toString().toLowerCase().includes(input);
					})
				);
				setRowData(filtered);
			}
		} catch (error) {
			console.error('Error in search:', error);
			setRowData([]); // Set empty data on error
		}
	};

	const handleExport = () => {
		const fields = columnDefs.map(col => col.field);

		const filteredData = data.map(item =>
		Object.fromEntries(
			fields.map(field => [field, item[field]])
		)
		);

		const worksheet = XLSX.utils.json_to_sheet(filteredData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		saveAs(blob, 'filtered-data.xlsx');
	};

	useEffect(() => {
		const fetchData = async () => {
			if (source) {
				try {
					setLoading(true);
					// Add required parameters if they're missing in the source URL
					const url = new URL(source, window.location.origin);
					if (!url.searchParams.has('portalName')) {
						url.searchParams.append('portalName', 'DMS');
					}
					
					const response = await dmsApi.get(url.pathname + url.search);
					setRowData(response.data);
				} catch (error) {
					console.error('Error fetching data:', error);
					setRowData([]); // Set empty data on error
				} finally {
					setLoading(false);
				}
			} else {
				setLoading(false);
			}
		};

		fetchData();
	}, [source]);

	const myTheme = themeMaterial.withParams({
		spacing: 7,
		foregroundColor: '#000',
		backgroundColor: '#e9ecef',
		headerBackgroundColor: '#dde0e3',
		headerRowBorder: false,
		rowBorder: '1px solid #dde0e3',
		headerTextColor: '#000000cc',
		rowHoverColor: '#ced0f4',
	});

	return (
		<div class="p-7">
			<div className="bg-primary-600 rounded-lg p-4 flex items-center justify-between text-white">
				<div className="flex w-1/2 rounded overflow-hidden">
					<label
						htmlFor="gridSearchBar"
						className="flex items-center px-4 bg-primary-500 text-white"
					>
						Search
					</label>
					 <input
						id="gridSearchBar"
						type="text"
						onChange={handleSearch}  
						className="flex-1 rounded-r border-0 bg-primary-500/60 text-primary px-4 py-2 focus:outline-none"
					/>
				</div>
				<button
					className="bg-primary-500 text-white flex items-center px-4 py-2 text-sm rounded hover:bg-primary-700"
					onClick={handleExport}
				>
					Export To Excel
				</button>
			</div>
			<div className="w-full mt-2 h-[538px] rounded-lg overflow-hidden">
				<AgGridReact
					theme={myTheme}
					columnDefs={enhancedColumnDefs}
					rowData={data}
					loading={loading}
					defaultColDef={{
						flex: 1,
						minWidth: 100,
						sortable: true,
						filter: true,
						resizable: true
					}}
					pagination={true}
					paginationPageSizeSelector={false}
					paginationPageSize={10}
					{...gridOptions}
				/>
			</div>
		</div>
	);
};

export default Table;
