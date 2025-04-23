import Header from "./Header";
import Files from "./Files";
import { useState } from "react";
const SideBar = () => {
  const [indexs, setIndex] = useState(1)

  function changeIndex(indi){
      setIndex(indi);
        console.log("Index changed")
        console.log(indexs)
  }

  return (
    <aside className="h-screen w-55 bg-off-white m-0">
      <Header />
      <Files changeIndex={changeIndex} setIndex={setIndex} indexs={indexs}/>
    </aside>
  );
};

export default SideBar;
