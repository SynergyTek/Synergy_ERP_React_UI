"use client"

import * as React from "react"
import { useMediaQuery } from "usehooks-ts"
import {
	Breadcrumb as BaseBreadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "~/ui/breadcrumb"
import { Icon } from "~"

function Breadcrumb({ path, onClick, activeIndex }) {
	const isDesktop = useMediaQuery("(min-width: 768px)")

	return (
		<BaseBreadcrumb>
			<BreadcrumbList>
				{path.map((item, index) => (
					<React.Fragment key={index}>
						<BreadcrumbItem>
							<BreadcrumbLink
								className={`max-w-20 truncate md:max-w-none cursor-pointer inline-flex items-center gap-1 ${
									index === activeIndex
										? "text-primary-700 font-semibold dark:text-white"
										: "text-muted-foreground"
								}`}
								onClick={() => onClick?.(item, index)}
							>
								{item.icon && <Icon icon={item.icon} size="sm" />}
								{item.label || item.title}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index < path.length - 1 && (
							<Icon icon={"angle-right"} size={"sm"} variant={"fas"} />
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</BaseBreadcrumb>
	)
}

export default Breadcrumb
