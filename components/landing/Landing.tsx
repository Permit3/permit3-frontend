import GrantAccess from "./GrantAccess";
import Sidebar from "../common/Sidebar";

function Landing() {
  return (
    <>
      <div className="w-screen h-full min-h-screen flex">
        <div className="pt-16 flex max-w-7xl mx-auto w-full">
          <Sidebar activeIdx={0} />
          <div className="h-full w-full">
            <GrantAccess />
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
