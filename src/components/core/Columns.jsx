import React from "react";

const Columns = ({ components, renderComponent }) => {
  return (
    <div className="flex flex-wrap">
      {components
        ? components.map((element, index) => {
            return (
              <div key={index} className={`w-full  px-2`}>
                {renderComponent(element)}
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Columns;
