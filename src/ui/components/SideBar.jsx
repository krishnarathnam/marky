import Header from "./Header";
import Files from "./Files";
import { useState } from "react";
const SideBar = () => {
  const [indexs, setIndex] = useState('allnotes')

  function changeIndex(indi){
        setIndex(indi);
  }

  return (
    <aside className="h-screen w-55 overflow-hidden bg-off-white m-0">
      <Header />
      <Files changeIndex={changeIndex} setIndex={setIndex} indexs={indexs}/>
    </aside>
  );
};

export default SideBar;
