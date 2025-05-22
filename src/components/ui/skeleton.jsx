import {cn} from "@/lib/utils"
import React from "react"

function Skeleton({
	                  className,
	                  ...props
                  }) {
	return (
		<div
			className={cn(`animate-pulse rounded-md text-secondary-400 dark:text-secondary-800 ${!props.children && "bg-secondary-400 dark:bg-secondary-800"}`, className)}
			{...props}
		>
			{props.children}
		</div>
	)
}

export default Skeleton