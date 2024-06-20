import Head from "next/head";
import dynamic from "next/dynamic";
import Permit from "@/components/permit/Permit";
const Navbar = dynamic(() => import("../components/Navbar"), {
  ssr: false
});

export default function Home() {
  return (
    <>
      <Head>
        <title>PERMIT3</title>
      </Head>
      <div className="h-32">
        <div className="h-16">
          <Navbar fixed={false} />
        </div>
      </div>
      <Permit />
    </>
  );
}
