import Header from "./Header";

const SideBar = ({ children }) => {
  const navItems = [
    "Home",
    "Quantum computing",
    "Master",
    "History",
    "On Me",
    "TKS",
    "Dev/CS",
    "Zap ⚡",
    "Creative writing",
    "All projects",
  ];


  return (
    <aside className="h-screen w-55 bg-off-white m-0">
      <Header />
      <div className="w-60 bg-off-white px-4 border-r overflow-y-auto ">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`text-sm px-3 py-2 rounded-md cursor-pointer 
            ${index === 1
                  ? "bg-white text-off-black font-medium shadow-sm"
                  : "text-dim-gray hover:text-off-black hover:bg-gray-100"
                }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
