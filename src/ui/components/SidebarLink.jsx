import {NavLink} from 'react-router'

export default function SideBarLink({to, icon, label}) {

	return(
		<NavLink
		    to={to}
		    className={({ isActive }) =>
		      `flex items-center gap-2 hover:text-dark-charcoal ${isActive ? "font-bold text-dark-charcoal" : "text-dim-gray"}`
		    }
	  	>
		    {icon}
		    {label}
	  	</NavLink>
	)
}