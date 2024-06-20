interface RadioProps {
  disabled?: boolean;
  groupName: string;
  defaultChecked?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
  checked?: boolean;
  value?: string;
  size?: "sm" | "md" | "lg";
}

function Radio(props: RadioProps) {
  const { size = "md" } = props;

  const fontSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "md":
        return "text-sm";
      case "lg":
        return "text-md";
    }
  };

  const classes =
    `focus:ring-0 focus:outline-0 bg-white border text-indigo-500 border-slate-300 disabled:bg-slate-50` + fontSize();
  return (
    <label className="flex items-center">
      <input
        type="radio"
        name={props.groupName}
        className={`${classes}`}
        disabled={props.disabled}
        defaultChecked={props.defaultChecked}
        onClick={props.onClick}
        checked={props.checked}
        value={props.value}
        onChange={() => {}}
      />
      {props.label && <span className={`select-none ml-2 ${fontSize()}`}>{props.label}</span>}
    </label>
  );
}

export default Radio;
