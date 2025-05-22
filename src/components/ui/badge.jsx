import * as React from "react"
import {cva} from "class-variance-authority";

import {cn} from "@/lib/utils"

const badgeVariants = cva(
	"inline-flex w-fit items-center rounded-full border border-slate-200 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300",
	{
		variants: {
			size: {
				"xs": "text-xs px-1.5 py-0.5",
				"sm": "text-xs px-2 py-0.5",
				"md": "text-sm px-2.5 py-1",
				"lg": "text-base px-3 py-1.5",
				"xl": "text-lg px-4 py-2",
			},
			variant: {
				default:
					"border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80",
				secondary:
					"border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
				destructive:
					"border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
				outline: "text-slate-950 dark:text-slate-50",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md"
		},
	}
)

function Badge({
	               className,
	               variant,
	               size,
	               ...props
               }) {
	return (<div className={cn(badgeVariants({variant, size}), className)} {...props} />);
}

export {Badge, badgeVariants}
