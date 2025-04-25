import Header from "./Header";
import Files from "./Files";
import { useState } from "react";
const SideBar = () => {
  const [indexs, setIndex] = useState('allnotes')

  function changeIndex(indi){
        setIndex(indi);
  }

  return (
    <aside className="h-screen w-55 bg-off-white m-0">
      <Header />
      <div className="flex flex-col h-full">
        {/* Set the scrollable area for files */}
        <div className="overflow-y-auto flex-1">
          <Files />
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
