import { ReactElement } from "react";

interface ButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  filled?: boolean;
  rounded?: boolean;
  style?: "primary" | "secondary" | "tertiary" | "tertiary-colored" | "danger" | "success" | "none";
  shadow?: boolean;
  customSizing?: boolean;
  customFont?: boolean;
  disabled?: boolean;
  loading?: boolean;
  grouped?: boolean;
  groupedSelected?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  icon?: ReactElement;
  children?: React.ReactElement | string;
  childElement?: JSX.Element;
  className?: string;
  tabIndex?: number;
  type?: "button" | "submit" | "reset";
  stopPropagation?: boolean;
  id?: string;
}

function Button(props: ButtonProps) {
  const {
    onClick,
    onBlur,
    filled = true,
    rounded = false,
    shadow = true,
    style = "primary",
    customSizing = false,
    customFont = false,
    disabled = false,
    loading = false,
    grouped = false,
    groupedSelected = false,
    size = "md",
    icon,
    children,
    childElement,
    className,
    tabIndex = -1,
    type,
    stopPropagation = true,
    id
  } = props;

  const bgAndBorderColor = () => {
    if (!filled) {
      return "border-2 border-white hover:border-white";
    }

    switch (style) {
      case "primary":
        if (disabled) {
          return "bg-primary-button/25 disabled:text-white";
        }
        return "bg-gradient-to-r from-gradient-default-start via-gradient-default-mid to-gradient-default-stop hover:from-gradient-hover-start hover:via-gradient-hover-mid hover:to-gradient-hover-stop active:from-gradient-active-start active:via-gradient-active-mid active:to-gradient-active-stop active:ring-2 active:ring-primary-600";
      case "secondary":
        if (disabled) {
          return "bg-[#2D3237] ring-2 ring-[#96989B] disabled:border-[#96989B] disabled:text-[#96989B]";
        }
        return "bg-[#2D3237] hover:bg-[#262A2E] active:bg-[#2D3237] ring-2 ring-white active:ring-white";
      case "tertiary":
        if (disabled) {
          return "disabled:border-muted-foreground disabled:text-secondary";
        }
        return "bg-transparent";
      case "tertiary-colored":
        if (disabled) {
          return "disabled:border-muted-foreground disabled:text-secondary";
        }
        return "bg-transparent";
      case "danger":
        return "bg-rose-500 hover:bg-rose-600 border-transparent";
      case "success":
        return "bg-emerald-500 hover:bg-emerald-600 border-transparent";
    }
  };

  const textColor = () => {
    switch (style) {
      case "primary":
        if (filled) {
          return "text-white";
        }
        if (disabled) {
          return "text-white";
        }
        return "text-blue-300 hover:text-opacity-90 active:text-opacity-80";
      case "secondary":
        if (grouped && !groupedSelected) {
          return "text-slate-600";
        }
        return "text-white";
      case "tertiary":
        if (grouped && groupedSelected) {
          return "text-black";
        }
        return "text-white";
      case "tertiary-colored":
        if (grouped && groupedSelected) {
          return "text-black";
        }
        if (disabled) {
          return "text-accent";
        }
        return "text-primary-primary hover:text-accent active:text-primary-primary";
      case "danger":
        if (filled) {
          return "text-white";
        }
        return "text-rose-500";
      case "success":
        if (filled) {
          return "text-white";
        }
        return "text-emerald-500";
    }
  };

  const padding = () => {
    if (customSizing) {
      return "";
    }

    if (rounded) {
      switch (size) {
        case "xs":
          return "px-3 py-0.5";
        case "sm":
          return "px-3 py-1";
        case "md":
          return "px-4 py-2";
        case "lg":
          return "px-5 py-3";
      }
    }
    switch (size) {
      case "xs":
        return "px-2 py-0.5";
      case "sm":
        return "px-2 py-1";
      case "md":
        return "px-3 py-2";
      case "lg":
        return "px-4 py-3";
    }
  };

  const groupedStyles = () => {
    if (rounded) {
      return `rounded-none first:rounded-l-full last:rounded-r-full`;
    }
    return `rounded-none first:rounded-l last:rounded-r`;
  };

  const disabledLoading = () => {
    if (filled) {
      return "disabled:cursor-not-allowed disabled:shadow-none";
    } else {
      return "disabled:text-opacity-80 disabled:cursor-not-allowed";
    }
  };

  let classes = `select-none${
    !customFont ? " font-quicksand font-medium text-sm" : ""
  } inline-flex items-center justify-center box-content ${rounded ? "rounded-full" : "rounded-md"} leading-5${
    shadow ? " shadow-sm " : ""
  }transition duration-150 ease-in-out`;
  classes += " " + bgAndBorderColor() + " " + textColor() + " " + padding() + " " + disabledLoading();

  if (grouped) {
    classes += " " + groupedStyles();
  }

  if (className) {
    classes += " " + className;
  }

  if (style === "none") {
    classes = className ? className : "";
  }

  return (
    <button
      onClick={(e: React.MouseEvent) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
        if (onClick) {
          onClick(e);
        }
      }}
      onBlur={onBlur}
      className={classes}
      disabled={disabled || loading}
      tabIndex={tabIndex}
      type={type}
      id={id}
    >
      {loading ? (
        <div className={children ? "mr-2" : ""}>
          <svg className="animate-spin w-4 h-4 fill-current shrink-0" viewBox="0 0 16 16">
            <path d="M8 16a7.928 7.928 0 01-3.428-.77l.857-1.807A6.006 6.006 0 0014 8c0-3.309-2.691-6-6-6a6.006 6.006 0 00-5.422 8.572l-1.806.859A7.929 7.929 0 010 8c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
          </svg>
        </div>
      ) : icon ? (
        <div className={children ? "mr-2" : ""}>{icon}</div>
      ) : null}
      {children ? children : ""}
      {childElement ? childElement : null}
    </button>
  );
}

export default Button;
