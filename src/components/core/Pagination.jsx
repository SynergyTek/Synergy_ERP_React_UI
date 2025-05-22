
import {useEffect, useState} from "react";
import {Button, Icon} from "~";

function Pagination({onChange, pages, props}) {
	const [currentPage, setCurrentPage] = useState(1);
	useEffect(() => {
		onChange(currentPage);
	}, [currentPage]);
	
	
	return (<ul className="flex rounded border border-primary-200 dark:border-primary-800">
		
		<Button className={"rounded-none rounded-l"}
		        icon={"chevron-double-left"}
		        size={"xs"}
		        mode={"tertiary"}
		        onClick={() => {
			        setCurrentPage(1);
		        }} />
		<Button className={"rounded-none"}
		        icon={"chevron-left"}
		        size={"xs"}
		        mode={"tertiary"}
		        onClick={() => {
			        setCurrentPage(Math.max(1, currentPage - 1));
		        }} />
		{Array.from({
			length: pages,
		}).map((page, index) => {
			return (
				<Button
					id={`page-${index + 1}`}
					key={index}
					size={"xs"}
					ratio={1}
					mode={currentPage === index + 1 ? "primary" : "tertiary"}
					className={`${[currentPage - 1, currentPage, currentPage + 1].includes(index + 1) ? "flex" : "hidden"} ${currentPage===index+1&&"bg-opacity-85"} rounded-none`}
					
					onClick={() => {
						setCurrentPage(index + 1);
					}}
					text={(index + 1).toString()}
				>
				
				</Button>);
		})}
		
		<Button className={"rounded-none"}
		        icon={"chevron-right"}
		        size={"xs"}
		        mode={"tertiary"}
		        onClick={() => {
			        setCurrentPage(Math.min(pages, currentPage + 1));
		        }} />
		<Button className={"rounded-none rounded-r"}
		        icon={"fa-chevron-double-right"}
		        size={"xs"}
		        mode={"tertiary"}
		        onClick={() => {
			        setCurrentPage(pages);
		        }} />
	</ul>)
}

export default Pagination;