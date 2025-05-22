import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {forwardRef, useEffect, useState} from "react";
import PropTypes from "prop-types";

const {library} = require('@fortawesome/fontawesome-svg-core')
import {all} from "@awesome.me/kit-9b926a9ec0/icons";
import {cva} from "class-variance-authority";
import {cn} from "@/lib/utils";
import Skeleton from "./skeleton";

library.add(...all)


const iconVariants = cva(
	"transition-all text-inherit aspect-square",
	
	{
		variants: {
			
			size: {
				xs: "w-2 h-2",
				sm: "w-3 h-3",
				default: "w-4 h-4",
				lg: "w-6 h-6",
				xl: "w-10 h-10",
				"2xl": "w-11 h-11",
				"3xl": "w-12 h-12",
				"4xl": "w-14 h-14",
				"5xl": "w-16 h-16",
				"6xl": "w-20 h-20",
				"7xl": "w-24 h-24",
				"8xl": "w-28 h-28",
				"9xl": "w-32 h-32",
				"10xl": "w-36 h-36",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
)

const Icon = forwardRef((
	{
		icon,
		className,
		variant = "far",
		hover = false,
		size, ...props
	},
	ref) => {
	if (props.skeleton) {
		return <Skeleton>
			<FontAwesomeIcon icon={["fas", icon]}
			                 className={cn(iconVariants({size, className}))} />
		
		</Skeleton>
	}
	const [hovered, setHovered] = useState(false)
	const [renderedIcon, setRenderedIcon] = useState([variant, icon])
	useEffect(() => {
		setRenderedIcon([variant, icon])
	}, [icon]);
	useEffect(() => {
		if (hover) {
			if (hover.container?.current) {
				hover.container.current.addEventListener("mouseenter", () => {
					setHovered(true)
				})
				hover.container.current.addEventListener("mouseleave", () => {
					setHovered(false)
				})
			}
		}
	}, [hover]);
	useEffect(() => {
		if (hovered) {
			setRenderedIcon([hover.variant || "fas", icon])
		} else {
			setRenderedIcon([variant, icon])
		}
	}, [hovered]);
	
	return (
		<FontAwesomeIcon icon={renderedIcon}
		                 className={cn(iconVariants({size, className}))}
		                 onMouseEnter={!hover?.container?.current ? () => setHovered(true) : null}
		                 onMouseLeave={!hover?.container?.current ? () => setHovered(false) : null}
		                 {...props}></FontAwesomeIcon>
	
	)
})
Icon.propTypes = {
	icon: PropTypes.string.isRequired,
	variant: PropTypes.string,
	size: PropTypes.string,
	className: PropTypes.string,
	hover: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}
export default Icon