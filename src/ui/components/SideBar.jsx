import Header from "./Header";
import Files from "./Files";
const SideBar = ({ children }) => {

  return (
    <aside className="h-screen w-55 bg-off-white m-0">
      <Header />
      <Files />
    </aside>
  );
};

export default SideBar;
