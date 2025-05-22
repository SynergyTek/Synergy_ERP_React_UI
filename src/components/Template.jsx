import {cloneElement, useEffect, useState} from "react";
import {flattenObject} from "@/lib/utils";

function Template({context, children, ...props}) {
	const checkForCode = (child) => {
		
		if (child.props && child.props.children) {
			if (typeof child.props.children === "string") {
				const regex = /_.*?_/;
				const match = child.props.children.match(regex);
				// console.log(match,match[0].slice(1, match[0].length - 1),context)
				return cloneElement({
					...child,
					props: {
						...child.props,
						children: context[match[0].slice(1, match[0].length - 1)]
					}
				})
			}
			if (Array.isArray(child.props.children)) {
				return child.props.children.map((c) => checkForCode(c));
			}
			return checkForCode(child.props.children);
		}
		return child;
	};
	const [renderedChildren, setRenderedChildren] = useState([])
	useEffect(() => {
		context = flattenObject(context);
		setRenderedChildren(Array.isArray(children)
			? children.map((c) => checkForCode(c))
			: checkForCode(children)
		)
	}, [context, children]);
	return (
		<>
			{cloneElement(children, {
				children: renderedChildren
			})
			}
		</>
	);
}

export default Template