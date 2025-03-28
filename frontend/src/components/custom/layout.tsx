import { Children } from "@/types";

const Layout = ({ children }: Children) => {
  return (
    <div className="flex flex-col items-center min-h-svh pt-20 px-5">
      <div className="max-w-[700px] w-full">
        <h1 className="text-3xl mb-3">Wallet System</h1>
        <hr className="mb-5" />
        {children}
      </div>
    </div>
  );
};

export default Layout;
