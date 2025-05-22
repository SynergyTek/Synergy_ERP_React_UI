import {cn} from "@/lib/utils";
import {cva} from "class-variance-authority";
import Skeleton from "~/ui/skeleton";

const textVariants = cva(
	"overflow-hidden",
	{
		variants: {
			color: {
				primary: "text-primary-950 dark:text-primary-100",
				secondary: "text-secondary-700 dark:text-secondary-400",
				tertiary: "text-tertiary-950 dark:text-tertiary-100",
				inherit: "text-inherit"
			},
			size: {
				"sm": "text-sm",
				"xs": "text-xs",
				"4xl": "text-4xl",
				"3xl": "text-3xl",
				"2xl": "text-2xl",
				"xl": "text-xl",
				"lg": "text-lg",
				"md": "text-base",
			},
			align:
				{
					center: "text-center",
					left: "text-left",
					right: "text-right",
					justify: "text-justify",
					start: "text-start",
					end: "text-end",
				},
			selectable: {
				true: "",
				false: "select-none"
			},
			wrap: {
				true: "text-wrap",
				word: "text-wrap word-break-all",
				break: "text-wrap break-all",
				false: "text-ellipsis text-nowrap"
			},
		},
		defaultVariants: {
			color: "primary",
			size: "md",
			align: "start",
			wrap: false,
			selectable: true
		},
	}
)

const variants = [
	"p",
	"span",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6"
]

function Text({variant, color, size, type, truncate = true, className, selectable, wrap, align, ...props}) {
	if (props.skeleton) {
		return <Skeleton className={cn(`h-4`, className)} />
	}
	const Comp = variants.includes(variant) ? variant : "p"
	return <Comp title={props.children}
	             className={cn(textVariants({align, color, className, wrap, size, selectable}))}>{props.children}</Comp>
}

export default Text;