interface SidebarProps {
  header?: JSX.Element[] | JSX.Element | string;
  content?: JSX.Element[] | JSX.Element | string;
  footer?: JSX.Element[] | JSX.Element | string;
  className?: string;
}

function Sidebar(props: SidebarProps) {
  return (
    <>
      <div
        className={`min-h-screen max-h-screen flex flex-col min-w-[30rem] max-w-[32rem] w-auto bg-gray-550${
          props.className ? " " + props.className : ""
        }`}
      >
        {props.header ? <div className="mb-6">{props.header}</div> : null}
        {props.content ? <div className="overflow-y-auto h-full body-overflow mb-6">{props.content}</div> : null}
        {props.footer ? <div className="mt-auto">{props.footer}</div> : null}
      </div>
    </>
  );
}

export default Sidebar;
