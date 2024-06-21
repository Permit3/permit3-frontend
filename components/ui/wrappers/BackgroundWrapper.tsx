import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/root";
import { setLoginType, setOpenLoginModal } from "../../../store/userSlice";
import { MODAL_TYPE, useGlobalModalContext } from "../modals/ModalContext";

function BackgroundAndWalletSelectWrapper(props: any) {
  const { openLoginModal } = useSelector((state: RootState) => state.user);
  const { showModal, hideModal, store } = useGlobalModalContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (openLoginModal) {
      showModal(
        MODAL_TYPE.WALLET_SELECT,
        {
          handleLoginType: (providerType: string) => {
            dispatch(setLoginType(providerType));
          },
          onClose: () => {
            dispatch(setOpenLoginModal(false));
          }
        },
        {
          showHeader: false,
          transparentBg: true,
          shadow: false,
          border: false,
          onClose: () => {
            hideModal(true);
            dispatch(setOpenLoginModal(false));
          }
        }
      );
    } else {
      // if (store.modalType === MODAL_TYPE.WALLET_SELECT) {
      hideModal(true);
      // }
    }
  }, [openLoginModal]);

  return (
    <div className={`flex min-h-screen font-quicksand opacity-100 text-white items-stretc bg-fixed bg-background`}>
      {props.children}
    </div>
  );
}

export default BackgroundAndWalletSelectWrapper;
