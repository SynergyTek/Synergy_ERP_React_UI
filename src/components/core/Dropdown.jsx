import {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {type} from "@/lib/utils";
import {toast} from "sonner";
import axios from "axios";
import {useMediaQuery} from "usehooks-ts";

import {Popover, PopoverContent, PopoverTrigger} from "~/ui/popover";
import {Button} from "~/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/ui/command";
import {Drawer, DrawerContent, DrawerTrigger} from "~/ui/drawer";
import {Icon, Loader, Text} from "~";
import PropTypes from "prop-types";
import {cva} from "class-variance-authority";

const sizeMap = {
	"xs": {trigger: "w[100pt]", popover: "w[100pt]"},
	"sm": {trigger: "w-[125pt]", popover: "w-[125pt]"},
	"md": {trigger: "w-[150pt]", popover: "w-[150pt]"},
	"lg": {trigger: "w-[175pt]", popover: "w-[175pt]"},
	"xl": {trigger: "", popover: ""},
	"2xl": {trigger: "", popover: ""},
	"3xl": {trigger: "", popover: ""},
}

const selectVariants = cva({})

const Dropdown = forwardRef(
	(
		{
			className,
			size = "md",
			source,
			map = {key: "id", value: "name"},
			defaultValue,
			onSelect,
			search = true,
			variant = "tertiary",
			reset = true,
			...props
		},
		ref
	) => {
		const [data, setData] = useState([]);
		const isDesktop = useMediaQuery("(min-width: 768px)");
		const [loading, isLoading] = useState(true);
		const [selected, setSelected] = useState(null);
		const [open, setOpen] = useState(false);
		const [value, setValue] = useState("");
		
		useMemo(() => {
			switch (type(source)) {
				case "array":
					setData(source);
					break;
				case "object":
					if (!source.type) toast("Source type not defined");
					switch (source.type.toLowerCase()) {
						case "lov":
							axios
								.get(
									`/dmsapi/cms/query/GetLOVIdNameList?lovType=${source.parameter}`
								)
								.then((res) => {
									console.log(res);
									setData(res.data);
								});
							break;
						case "enum":
							axios
								.get(
									`/dmsapi/cms/query/GetEnumIdNameList?enumType=${source.parameter}`
								)
								.then((res) => {
									console.log(res);
									setData(res.data);
								});
							break;
						case "table":
							axios
								.get(
									`/dmsapi/cms/query/cms/query/TableData?tableName=${source.parameter}`
								)
								.then((res) => {
									console.log(res);
									setData(res.data);
								});
					}
					break;
				case "string":
					axios
						.get(source)
						.then((res) => {
							if (!res.data) {
								console.error("No data found");
								setData([]);
							}
							let sortedData = res.data.sort((a, b) => {
								return a[map.id] > b[map.id];
							});
							setData(sortedData);
						})
						.catch((e) => {
							console.log(e);
							isLoading(false);
						});
			}
		}, [source]);

		useMemo(() => {
			if (defaultValue) {
				let defaultKey = defaultValue;
				if (type(defaultValue) === "object") {
					defaultKey = data.find(
						(d) => {
							return d[defaultKey.key] === defaultValue[defaultKey.key]
						}
					);
				}
				setSelected(defaultKey);
			}
		}, [data]);

		useEffect(() => {
			isLoading(false);
		}, []);
		
		useEffect(() => {
			selected && onSelect && onSelect(selected);
		}, [selected]);
		
		return loading ? (
			<Loader />
		) : isDesktop ? (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild ref={ref}>
					{props.children}
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align={props.align || "start"}>
					{loading ? (
						<Loader />
					) : (
						<ContentList
							data={data}
							map={map}
							setOpen={setOpen}
							setSelected={setSelected}
							search={search}
						/>
					)}
				</PopoverContent>
			</Popover>
		) : (
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild ref={ref}>
					{props.children}
				</DrawerTrigger>
				<DrawerContent>
					{loading ? (
						<Loader />
					) : (
						<div className="mt-4 border-t">
							<ContentList
								data={data}
								map={map}
								setOpen={setOpen}
								setSelected={setSelected}
								search={search}
							/>
						</div>
					)}
				</DrawerContent>
			</Drawer>
		);
	}
);

function ContentList({setOpen, search, setSelected, data, map}) {
	return (
		<Command>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup>
					{data.map((item) => {
						const itemRef = useRef(null);
						return (
							<CommandItem
								ref={itemRef}
								key={item[map.key]}
								value={item[map.value]}
								onSelect={() => {
									if (item.onClick) {
										item.onClick(item);
									}
									setOpen(false);
								}}
								className="flex items-center gap-2"
							>
								{item.icon && <Icon icon={item.icon} />}
								<span>{item[map.value]}</span>
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}

Dropdown.propTypes = {
	/**
	 * The source of the data. Can be an array, object or a string
	 */
	source: PropTypes.oneOf(["array", "object", "string"]),
	/**
	 * Which fields should be mapped to your data?
	 * */
	map: PropTypes.shape({
		key: PropTypes.string,
		value: PropTypes.string,
	}),
};

export default Dropdown;
