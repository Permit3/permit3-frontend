import { useCallback, useEffect } from "react";
import { guidGenerator } from "../../utils/misc";
import { useNotification } from "../../utils/notification/NotificationProvider";
import { Connector, useAccount, useConnect } from "@starknet-react/core";

interface ConnectorItemProps {
  name: string;
  icon: any;
  onClick: (e?: any) => void;
  [key: string]: any;
}

interface WalletSelectProps {
  handleLoginType: (e?: any) => void;
  onClose: (e?: any) => void;
  [key: string]: any;
}

const ConnectorItem = (props: ConnectorItemProps) => {
  const { name, icon, description, onClick } = props;

  const renderLogo = useCallback(
    (Logo: any) => <img src={icon} key={`connect-${name}-logo`} className="flex-shrink-0 w-8 h-8" />,
    []
  );

  return (
    <>
      <div
        className={`w-full p-6 gap-4 flex flex-wrap sm:flex-nowrap justify-center items-center rounded-lg cursor-pointer ring-2 ring-white hover:bg-black/10 active:bg-black/20 select-none`}
        onClick={onClick}
      >
        <span className="whitespace-nowrap text-center sm:text-start truncate">
          <span className="block text-base font-medium">{name}</span>
          <span className={`w-full text-xs mx-0 mt-2 sm:mt-0 text-opacity-40 font-normal`}>{description}</span>
        </span>
        <span className="flex items-center space-x-6">{renderLogo(icon)}</span>
      </div>
    </>
  );
};

const Divider = () => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
      <div className="h-0.5 w-full bg-black bg-opacity-10"></div>
      <span className="text-sm font-medium text-black text-opacity-80">or continue with</span>
      <div className="h-0.5 w-full bg-black bg-opacity-10"></div>
    </div>
  );
};

const WalletSelect = (props: WalletSelectProps) => {
  const { handleLoginType, onClose, open } = props;
  const { connect, connectors } = useConnect();
  const { address, isConnected, isReconnecting, account } = useAccount();
  const { NotificationAdd } = useNotification();

  useEffect(() => {
    if (isConnected) {
      if (onClose) {
        onClose();
      }
    }
  }, [isConnected, onClose]);

  const renderConnector = useCallback(
    (connector: Connector | undefined) =>
      connector ? (
        <ConnectorItem
          key={`${connector.id}-${connector.name}`}
          name={connector.name}
          icon={connector.icon?.light}
          onClick={() => {
            connect({ connector });
            handleLoginType(connector.id);
          }}
        />
      ) : (
        <Divider key={guidGenerator()} />
      ),
    [handleLoginType, connect]
  );

  return (
    <div
      className={`overflow-auto max-h-full relative w-[calc(100%-2rem)] bg-modal border border-[#1F2328] border-opacity-80 rounded-lg m-3 mr-4 mb-6 xs:mx-auto p-6 xs:w-[410px] space-y-6`}
    >
      {connectors.map(renderConnector)}
    </div>
  );
};

export default WalletSelect;
