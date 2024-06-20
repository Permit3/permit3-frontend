import React, { useState, useEffect } from "react";
import Button from "../../components/ui/forms/Button";

const Notification = (props: {
  type: string;
  sticky: boolean;
  stateAction: (arg0: { type: string; id: string }) => void;
  id: string;
  hasClose: boolean;
  toClose: boolean;
  title: string;
  message: string;
}) => {
  const [width, setWidth] = useState(100);
  const [intervalID, setIntervalID] = useState(0);
  const [exit, setExit] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [notifiColor, setNotifiColor] = useState(Array<string>);

  const handleCloseProgrammatically = () => {
    if (props.toClose == true) handleClosedNotification(props.id);
  };

  const handleNotificationColor = () => {
    if (props.type == "ERROR") {
      setNotifiColor(["bg-[#dc3545] border-l-8 border-[#bd1120]", "bg-[#dc3545]"]);
    } else if (props.type == "SUCCESS") {
      setNotifiColor(["bg-[#28a745] border-l-8 border-[#1f8838]", "bg-[#28a745]"]);
    } else if (props.type == "WARNING") {
      setNotifiColor(["bg-[#eab000] border-l-8 border-[#ce9c09]", "bg-[#eab000]"]);
    } else if (props.type == "INFO") {
      setNotifiColor(["bg-[#685dc3] border-l-8 border-[#4c3fb1]", "bg-[#685dc3]"]);
    }
  };

  const handleStartTimer = () => {
    const id: any = setInterval(() => {
      if (!props.sticky) {
        setWidth((prev: number) => {
          if (prev > 0) {
            return prev - 0.1;
          }
          clearInterval(id);
          return prev;
        });
      }
    }, 20);
    setIntervalID(id);
  };

  const handleParseTimer = () => {
    clearInterval(intervalID);
  };

  const handleClosedNotification = (id: string) => {
    setExit(true);
    setTimeout(() => {
      setHidden(true);
    }, 500);
    setTimeout(() => {
      //remove the state therefore the dom
      props.stateAction({
        type: "REMOVE_NOTIFICATION",
        id: id
      });
    }, 500);
    handleParseTimer();
  };

  useEffect(() => {
    handleCloseProgrammatically();
  }, [props.toClose]);

  useEffect(() => {
    handleStartTimer();
    handleNotificationColor();
  }, []);

  useEffect(() => {
    width <= 0 && handleClosedNotification(props.id);
  }, [width]);

  return (
    <div
      className={`${hidden ? "hidden" : ""} ${exit ? "animate-fade-out-down opacity-0" : "animate-fade-in-up"} w-80`}
    >
      <div className={`${notifiColor[0]} flex relative mb-1 rounded-sm shadow-notification-div cursor-pointer z-50`}>
        <div className="inline-block pt-2 pb-2 pl-4 pr-4 w-full">
          <div className="flex justify-center items-center rounded-3xl h-5 w-5 absolute right-2 top-1.5">
            {props.hasClose && (
              <Button
                className="flex justify-center items-center rounded-3xl h-5 w-5 absolute right-2.5 top-2.5"
                customFont={true}
                filled={false}
                rounded={false}
                customSizing={true}
                grouped={false}
                icon={
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M7.0001 0L3.99965 2.99975L0.99991 0L0 0.99991L2.99975 3.99965L0 6.9994L0.99991 7.9993L3.99965 4.99955L7.0001 7.9993L8 6.9994L5.00025 3.99965L8 0.99991L7.0001 0Z"
                      fill="white"
                    />
                  </svg>
                }
                onClick={() => handleClosedNotification(props.id)}
              ></Button>
            )}
          </div>
          <div className="text-white text-sm font-bold mt-1.5">{props.title}</div>
          <div className="break-words text-white text-sm leading-4 mb-2.5 mt-1 w-[calc(100%-15px)]">
            {props.message}
          </div>
          {props.sticky ? (
            <></>
          ) : (
            <div className={`${notifiColor[1]} rounded-md h-1 mt-1.5 mb-0 w-full`}>
              <div className="bg-white rounded-md h-1" style={{ width: `${width}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
