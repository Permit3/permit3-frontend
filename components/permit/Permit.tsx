import Sidebar from "../common/Sidebar";
import ContractCard from "./ContractCard";

function Landing() {
  return (
    <>
      <div className="w-screen h-full min-h-screen flex">
        <div className="pt-16 flex max-w-7xl mx-auto w-full">
          <Sidebar activeIdx={1} />
          <div className="h-full w-full flex flex-col gap-4 p-6 md:p-12">
            <ContractCard address="0x123412df" />
            <ContractCard address="0x123412df" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
