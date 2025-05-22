import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "~/ui/command";
import { Icon, Text } from "~";

let cmHandler = function () {};
cmHandler.current = null;

cmHandler.show = (event, options, context) => {};
cmHandler.hide = () => {setOpen(false);
  setOpenSubIndex(null); };

const ContextMenuTrigger = ({ options, context, ...props }) => {
  const handleContextMenu = (event) => {
    event.preventDefault();
    cmHandler.show(event, options, context);
  };

  return (
    <div onContextMenu={handleContextMenu} {...props}>
      {props.children}
    </div>
  );
};

ContextMenuTrigger.propTypes = {
  options: PropTypes.array,
  context: PropTypes.any,
  children: PropTypes.node,
};

const ContextMenu = () => {
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [submenuItems, setSubmenuItems] = useState(null);
  const [submenuPos, setSubmenuPos] = useState({ x: 0, y: 0 });
  const [openSubIndex, setOpenSubIndex] = useState(null);

  const menuRef = useRef();
  const submenuRef = useRef();

  useEffect(() => {
	const hideHandler = () => {
	  setOpen(false);
	  setSubmenuItems(null); // Clear submenu items when the parent menu is hidden
	};
	document.addEventListener("click", hideHandler);
	document.addEventListener("blur", hideHandler);
	return () => {
	  document.removeEventListener("click", hideHandler);
	  document.removeEventListener("blur", hideHandler);
	};
  }, []);
  

  cmHandler.show = (event, eventOptions, passedContext) => {
    setContext(passedContext);
    setData(eventOptions);

    const offsetBox = event.currentTarget.offsetParent;
    const offsetLeft = offsetBox?.offsetLeft || 0;
    const offsetTop = offsetBox?.offsetTop || 0;
    const maxWidth = offsetBox?.clientWidth || window.innerWidth;
    const maxHeight = offsetBox?.clientHeight || window.innerHeight;

    const posX = event.clientX;
    const posY = event.clientY;

    setTimeout(() => {
      const menuWidth = menuRef.current?.offsetWidth || 200;
      const menuHeight = menuRef.current?.offsetHeight || 200;

      const finalX = posX + menuWidth > offsetLeft + maxWidth
        ? offsetLeft + maxWidth - menuWidth
        : posX;

      const finalY = posY + menuHeight > offsetTop + maxHeight
        ? offsetTop + maxHeight - menuHeight
        : posY;

      setX(finalX);
      setY(finalY);
      setOpen(true);
    }, 10);
  };

  useEffect(() => {
    if (!open) setData(null);
  }, [open]);

  const showSubmenu = (e, item) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const submenuX = rect.right + 4;
    const submenuY = rect.top;

    setSubmenuPos({ x: submenuX, y: submenuY });
    setSubmenuItems(item.children || null);
  };

  return (
    <>
      {open && (
        <div
          ref={menuRef}
          className="absolute z-50 bg-white dark:bg-black shadow-md border rounded min-w-[180px]"
          style={{ top: y, left: x }}
        >
          <Command>
            <CommandList>
              {data ? (
                <CommandGroup>
                  {data.map((item, index) => {
                    if (item.children) {
                      return (
                        <div
                          key={index}
                          className="relative group"
                          onMouseEnter={(e) => showSubmenu(e, item)}
						  
                        >
                          <CommandItem className="flex gap-2 items-center">
                            {item.icon && <Icon size="sm" icon={item.icon} />}
                            <Text size="sm">{item.label}</Text>
                            <FontAwesomeIcon icon="angle-right" className="ml-auto" />
                          </CommandItem>
                        </div>
                      );
                    } else {
                      return (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            item.onClick?.({ id: context?.Id,data: context}); // 👈 Fix is here
                            setOpen(false);
                            setOpenSubIndex(null);
                          }}
                          
                          className="flex gap-2 items-center"
                        >
                          {item.icon && <Icon size="sm" icon={item.icon} />}
                          <Text size="sm">{item.label}</Text>
                        </CommandItem>
                      );
                    }
                  })}
                </CommandGroup>
              ) : (
                <CommandEmpty>No options configured</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}

      {submenuItems && (
        <div
          ref={submenuRef}
          className="absolute z-50 bg-white dark:bg-black shadow-md border rounded min-w-[180px]"
          style={{ top: submenuPos.y, left: submenuPos.x }}
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {submenuItems.map((subItem, subIndex) => (
                  <CommandItem
                    key={subIndex}
                    onSelect={() => {
                      subItem.onClick?.({ id: context?.Id ,data:context}); // ✅ Correct: subItem, not item
                      setOpen(false);
                      setOpenSubIndex(null);
                    }}
                    
                    className="flex gap-2 items-center"
                  >
                    {subItem.icon && <Icon size="sm" icon={subItem.icon} />}
                    <Text size="sm">{subItem.label}</Text>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </>
  );
};

export { ContextMenu, ContextMenuTrigger, cmHandler };