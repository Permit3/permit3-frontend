import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { guidGenerator } from "../../../utils/misc";
import Dropdown from "../dropdown/Dropdown";
import Tooltip from "../Tooltip";
import TooltipWrapper from "../TooltipWrapper";

interface SelectChildType {
  icon?: string;
  value?: string;
  label: string;
}

interface SelectProps {
  className?: string;
  label?: string;
  id?: string;
  tooltip?: string;
  required?: boolean;
  disabled?: boolean;
  selectProps?: { [key: string]: any };
  selectChildren?: SelectChildType[];
  children?: JSX.Element | (JSX.Element | null)[];
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function Select(props: SelectProps) {
  const {
    id = "",
    className = "",
    selectProps = {},
    tooltip,
    label,
    required = false,
    disabled = false,
    selectChildren = [],
    children = [],
    value,
    onChange
  } = props;

  const [selectedItem, handleSelectedItem] = useState<SelectChildType>();

  let selectId = id;
  if (selectId === "") {
    selectId = guidGenerator();
  }
  const classes =
    "focus:ring-0 focus:outline-0 text-sm text-black border-0 fill-black rounded leading-5 py-2 pl-3 pr-8 appearance-none bg-[length:1.5rem_1.5rem] bg-no-repeat bg-[right_0.5rem_center]";

  // const classes =
  //   "focus:ring-0 focus:outline-0 text-sm text-white border-none bg-transparent rounded leading-5 py-2 px-3 appearance-none";

  useEffect(() => {
    if (value) {
      if (parseInt(value) >= 0) {
        handleSelectedItem(selectChildren[parseInt(value)]);
        if (onChange) {
          const e: any = { target: { value: value } };
          onChange(e);
        }
      }
    } else {
      handleSelectedItem(selectChildren.length > 0 ? selectChildren[0] : undefined);
      if (onChange) {
        const e: any = { target: { value: 0 } };
        onChange(e);
      }
    }
  }, [value, selectChildren]);

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between">
          {label ? (
            <label className="block text-sm font-medium mb-1" htmlFor={selectId}>
              {label}
              {required ? <span className="text-rose-500"> *</span> : ""}
            </label>
          ) : null}
          {tooltip ? (
            <Tooltip className="ml-2" bg="dark" size="md">
              <div className="text-sm text-slate-200">{tooltip}</div>
            </Tooltip>
          ) : null}
        </div>
        <div className="flex w-full">
          {selectChildren.length > 0 ? (
            <Dropdown
              className="border-opacity-25 border py-2"
              align="right"
              // @ts-ignore
              button={
                <div className="select-none flex whitespace-nowrap h-full">
                  <img className="h-4 w-4 mr-1 my-auto" src={selectedItem?.icon ? selectedItem.icon : ""} />
                  {selectedItem?.label && selectedItem.label.length > 6 ? (
                    <TooltipWrapper text={selectedItem.label} position="top">
                      <div>
                        {selectedItem?.label.substring(0, 6) +
                          (selectedItem?.label && selectedItem.label.length > 6 ? "..." : "")}
                      </div>
                    </TooltipWrapper>
                  ) : (
                    <div>
                      {selectedItem?.label.substring(0, 6) +
                        (selectedItem?.label && selectedItem.label.length > 6 ? "..." : "")}
                    </div>
                  )}
                  <span className="ml-1 mt-px">
                    <svg width="10" height="100%" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 9L0.0717975 3.51391e-07L13.9282 -8.59975e-07L7 9Z" fill="black" />
                    </svg>
                  </span>
                </div>
              }
              // @ts-ignore
              dropdownChildren={(open, handleDropdownOpen) => {
                return selectChildren.map((child, idx) => (
                  <div
                    key={`${selectId}-${idx}`}
                    className="select-none flex whitespace-nowrap cursor-pointer bg-white hover:bg-gray-21 active:bg-gray-23 rounded-md p-2 mx-2"
                    onClick={(e: any) => {
                      handleSelectedItem(child);
                      handleDropdownOpen(false);
                      if (onChange) {
                        e.target.value = idx;
                        onChange(e);
                      }
                    }}
                  >
                    <img className="h-4 w-4 mr-1 my-auto" src={child.icon ? child.icon : ""} />
                    {child.label.length > 6 ? (
                      <TooltipWrapper text={child.label} position="top-right">
                        <div>{child.label.substring(0, 6) + "..."}</div>
                      </TooltipWrapper>
                    ) : (
                      <div>{child.label.substring(0, 6)}</div>
                    )}
                  </div>
                ));
              }}
            />
          ) : (
            <select
              id={selectId}
              className={`${classes} ${className}`}
              required={required}
              disabled={disabled}
              {...selectProps}
              value={
                value
                  ? value
                  : Object.prototype.toString.call(children) === "[object Array]"
                  ? // @ts-ignore
                    children[0].props.value
                  : // @ts-ignore
                    children.props.value
              }
              onChange={onChange}
            >
              {children}
            </select>
          )}
        </div>
      </div>
    </>
  );
}

export default Select;
