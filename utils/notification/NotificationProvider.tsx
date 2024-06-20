import React, { createContext, useContext, useReducer } from "react";
import { v4 } from "uuid";
import Notification from "./Notification";

const NotificationContext = createContext<any>(() => null);

const NotificationProvider = (props: { children: React.ReactElement<string> }) => {
  const [state, stateAction] = useReducer((state: any, action: any) => {
    switch (action.type) {
      case "ADD_NOTIFICATION":
        return [{ ...action.payload }, ...state];
      case "REMOVE_NOTIFICATION":
        return state.filter((el: { id: string }) => el.id !== action.id);
      case "UPDATE_NOTIFICATION":
        return state.map((el: { id: string; toClose: boolean }) => {
          const temp = Object.assign({}, el);
          if (el.id === action.id) el.toClose = true;
          return temp;
        });
      default:
        return state;
    }
  }, []);

  return (
    <NotificationContext.Provider value={stateAction}>
      <div className="h-full w-full">
        {/* notification wrapper */}
        <div className="fixed bottom-5 right-5 pointer-events-auto min-w-325 text-white z-100">
          <></>
          {state.map(
            (note: {
              id: string;
              toClose: boolean;
              type: string;
              title: string;
              message: string;
              sticky: boolean;
              hasClose: boolean;
            }) => {
              return (
                <Notification
                  id={note.id}
                  toClose={note.toClose}
                  type={note.type}
                  sticky={note.sticky}
                  hasClose={note.hasClose}
                  title={note.title}
                  message={note.message}
                  stateAction={stateAction}
                  key={note.id}
                />
              );
            }
          )}
        </div>
        {props.children}
      </div>
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  const addNotification = useContext(NotificationContext);
  const deleteNotification = useContext(NotificationContext);
  const NotificationAdd = (
    type: "ERROR" | "SUCCESS" | "WARNING" | "INFO",
    title: string,
    message?: string,
    id?: string,
    sticky = false,
    hasClose = true,
    toClose = false
  ) => {
    addNotification({
      type: "ADD_NOTIFICATION",
      payload: {
        id: id ? id : v4(),
        sticky: sticky,
        type: type,
        title: title,
        message: message,
        hasClose: hasClose,
        toClose: toClose
      }
    });
  };

  const NotificationDelete = (id: string) => {
    deleteNotification({
      type: "UPDATE_NOTIFICATION",
      id: id
    });
  };

  return {
    NotificationAdd,
    NotificationDelete
  };
}

export default NotificationProvider;
