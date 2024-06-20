import { ReactElement } from "react";

interface PillProps {
  text: string;
  color?: string;
  rounded?: boolean;
  icon?: ReactElement;
}

function Pill(props: PillProps) {
  const { text, color, rounded = false, icon } = props;
  const getColor = () => {
    switch (color) {
      case "blue":
        return "bg-blue-300 text-blue-300";
      case "green":
        return "bg-green-400 text-green-400";
      case "red":
        return "bg-red-400 text-red-400";
      default:
        return "bg-secondary text-white";
    }
  };
  return (
    <div
      className={`font-quicksand bg-opacity-10 ${getColor()} select-none py-1 px-2 ${
        rounded ? "rounded-full" : "rounded-xl"
      } flex flex-nowrap`}
    >
      {icon ? <div className="mr-2 my-auto">{icon}</div> : null}
      <div className="my-auto">{text}</div>
    </div>
  );
}

export default Pill;
