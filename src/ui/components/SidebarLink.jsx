import { NavLink } from 'react-router'

export default function SideBarLink({ to, icon, label }) {

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2  ${isActive && "font-bold font-[#cccccc]"}`
      }
    >
      {icon}
      {label}
    </NavLink>
  )
}
