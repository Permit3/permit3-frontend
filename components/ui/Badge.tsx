interface BadgeWrapperProps {
  children: JSX.Element;
  badge: JSX.Element;
}

function BadgeWrapper(props: BadgeWrapperProps) {
  return (
    <div className="relative">
      {props.children}
      <div className="absolute top-0 right-0 -mr-3 w-4 h-4">{props.badge}</div>
    </div>
  );
}

export default BadgeWrapper;
