import {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {cn, type} from "@/lib/utils";
import {toast} from "sonner";
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
import {dmsApi} from "../../../client";
import { XCircleIcon } from "lucide-react";

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

const MultiSelect = forwardRef(
    (
        {
            className,
            size = "md",
            source,
            map = {key: "id", value: "name"},
            defaultValue = [],
            onSelect,
            search = true,
            variant = "outline",
            reset = true,
            unselectedText = "Select Items",
            maxDisplay = 2,
            ...props
        },
        ref
    ) => {
        const [data, setData] = useState([]);
        const isDesktop = useMediaQuery("(min-width: 768px)");
        const [loading, isLoading] = useState(true);
        const [selected, setSelected] = useState([]);
        const [open, setOpen] = useState(false);
        const [value, setValue] = useState("");
        ref = ref || useRef()
        
        if (ref.current) ref.current.clear = () => {
            setSelected([]);
        }

        useMemo(() => {
            switch (type(source)) {
                case "array":
                    setData(source);
                    break;
                case "object":
                    if (!source.type) toast("Source type not defined");
                    switch (source.type.toLowerCase()) {
                        case "lov":
                            dmsApi
                                .get(
                                    `/cms/query/GetLOVIdNameList?lovType=${source.parameter}`
                                )
                                .then((res) => {
                                    console.log(res);
                                    setData(res.data);
                                });
                            break;
                        case "enum":
                            dmsApi
                                .get(
                                    `/cms/query/GetEnumIdNameList?enumType=${source.parameter}`
                                )
                                .then((res) => {
                                    console.log(res);
                                    setData(res.data);
                                });
                            break;
                        case "table":
                            dmsApi
                                .get(
                                    `/cms/query/cms/query/TableData?tableName=${source.parameter}`
                                )
                                .then((res) => {
                                    console.log(res);
                                    setData(res.data);
                                });
                    }
                    break;
                case "string":
                    dmsApi
                        .get(source)
                        .then((res) => {
                            if (!res.data) {
                                console.error("No data found");
                                setData([]);
                            }
                            let sortedData = res.data.sort((a, b) => {
                                return a[map.key] > b[map.key] ? 1 : -1;
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
            if (defaultValue && defaultValue.length > 0) {
                const defaultItems = data.filter(d => 
                    defaultValue.some(val => 
                        type(val) === "object" 
                            ? d[map.key] === val[map.key]
                            : d[map.key] === val
                    )
                );
                setSelected(defaultItems);
            }
        }, [data]);

        useEffect(() => {
            isLoading(false);
        }, []);

        useEffect(() => {
            onSelect && onSelect(selected);
            props.onChange && props.onChange(selected.map(item => item[map.key]));
        }, [selected]);

        const handleSelect = (item) => {
            const isSelected = selected.some(sel => sel[map.key] === item[map.key]);
            if (isSelected) {
                setSelected(selected.filter(sel => sel[map.key] !== item[map.key]));
            } else {
                setSelected([...selected, item]);
            }
        };

        const handleRemoveAll = () => {
            setSelected([]);
        };

        const getDisplayText = () => {
            if (!selected.length) return unselectedText;
            if (selected.length <= maxDisplay) {
                return selected.map(item => item[map.value]).join(", ");
            }
            return `${selected.length} items selected`;
        };

        const renderSelectedTags = () => {
            return selected.map((item) => (
                <div
                    key={item[map.key]}
                    className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-md px-2 py-1 text-sm mr-1 mb-1"
                >
                    {item[map.value]}
                    <XCircleIcon
                        className="h-4 w-4 cursor-pointer hover:text-primary/70"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(item);
                        }}
                    />
                </div>
            ));
        };

        return loading ? (
            <Loader/>
        ) : isDesktop ? (
            <div className="flex flex-col w-full">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={variant}
                            className={cn(
                                "justify-start min-h-[42px] h-auto flex-wrap gap-1 font-normal",
                                !selected.length && "text-muted-foreground",
                                className
                            )}
                            ref={ref}
                            size={size}
                        >
                            {selected.length > 0 ? renderSelectedTags() : unselectedText}
                            <Icon
                                icon="chevron-down"
                                className={`ml-auto shrink-0 hover:translate-y-0.5 ${open ? "rotate-180" : "rotate-0"}`}
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        {loading ? (
                            <Loader/>
                        ) : (
                            <div className="flex flex-col">
                                <ContentList
                                    data={data}
                                    map={map}
                                    setOpen={setOpen}
                                    selected={selected}
                                    onSelect={handleSelect}
                                    search={search}
                                />
                                {selected.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        className="mt-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600"
                                        onClick={handleRemoveAll}
                                    >
                                        Remove All
                                    </Button>
                                )}
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
            </div>
        ) : (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant={variant}
                        className={cn(
                            "justify-start min-h-[42px] h-auto flex-wrap gap-1 font-normal",
                            !selected.length && "text-muted-foreground",
                            className
                        )}
                        ref={ref}
                        size={size}
                    >
                        {selected.length > 0 ? renderSelectedTags() : unselectedText}
                        <Icon
                            icon="chevron-down"
                            className={`ml-auto shrink-0 hover:translate-y-0.5 ${open ? "rotate-180" : "rotate-0"}`}
                        />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    {loading ? (
                        <Loader/>
                    ) : (
                        <div className="mt-4 border-t">
                            <ContentList
                                data={data}
                                map={map}
                                setOpen={setOpen}
                                selected={selected}
                                onSelect={handleSelect}
                                search={search}
                            />
                            {selected.length > 0 && (
                                <Button
                                    variant="ghost"
                                    className="mt-2 w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600"
                                    onClick={handleRemoveAll}
                                >
                                    Remove All
                                </Button>
                            )}
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        );
    }
);

function ContentList({setOpen, search, selected, onSelect, data, map}) {
    return (
        <Command className="border rounded-lg">
            {search && (
                <CommandInput 
                    placeholder="Search ..." 
                    className="border-none focus:ring-0"
                />
            )}
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {data.map((item) => {
                        const isSelected = selected.some(sel => sel[map.key] === item[map.key]);
                        return (
                            <CommandItem
                                key={item[map.key]}
                                value={item[map.value]}
                                onSelect={() => {
                                    onSelect(item);
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 cursor-pointer",
                                    isSelected && "bg-primary/10"
                                )}
                            >
                                <div className={cn(
                                    "flex-shrink-0 rounded border w-4 h-4 flex items-center justify-center",
                                    isSelected && "bg-primary border-primary text-white"
                                )}>
                                    {isSelected && <Icon icon="check" size="sm" />}
                                </div>
                                <span className={cn(
                                    "flex-1",
                                    isSelected && "text-primary font-medium"
                                )}>
                                    {item[map.value]}
                                </span>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}

MultiSelect.propTypes = {
    source: PropTypes.oneOf(["array", "object", "string"]),
    map: PropTypes.shape({
        key: PropTypes.string,
        value: PropTypes.string,
    }),
    maxDisplay: PropTypes.number,
    defaultValue: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object
        ])
    ),
};

export default MultiSelect; 