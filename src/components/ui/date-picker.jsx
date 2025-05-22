import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { forwardRef, useRef, useState, useEffect } from "react";

const DatePicker = forwardRef(({ className, value, onChange, dateFormat, text }, ref) => {
	const [date, setDate] = useState(value);

	const handleDateChange = (newDate) => {
		setDate(newDate);
	};

	useEffect(() => {
		onChange && onChange(date);
	}, [date]);

	ref = ref || useRef();
	if (ref.current)
		ref.current.clear = () => {
			setDate(null);
		};
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal" + className,
						!date && "text-muted-foreground"
					)}
					value={date && (dateFormat ? format(date, dateFormat) : format(date, "PPP"))}
					ref={ref}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : (text ? text : <span>Pick a date</span>)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleDateChange}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
});

const DatePickerWithRange = forwardRef(
	({ className, value, onChange }, ref) => {
		const [date, setDate] = useState();

		return (
			<div className={cn("grid gap-2", className)}>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							id="date"
							variant={"outline"}
							className={cn(
								"w-[300px] justify-start text-left font-normal",
								!date && "text-muted-foreground"
							)}
							value={date}
							ref={ref}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date?.from ? (
								date.to ? (
									<>
										{format(date.from, "LLL dd, y")} -{" "}
										{format(date.to, "LLL dd, y")}
									</>
								) : (
									format(date.from, "LLL dd, y")
								)
							) : (
								<span>Pick a date</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							initialFocus
							mode="range"
							defaultMonth={date?.from}
							selected={date}
							onSelect={setDate}
						/>
					</PopoverContent>
				</Popover>
			</div>
		);
	}
);

export default DatePicker;
export { DatePickerWithRange };
