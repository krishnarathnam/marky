import React, { useState } from 'react'
import { NavLink } from 'react-router'
import { Trash2 } from 'lucide-react'

export default function SideBarFolder({ count, folder, icon, label, to, onDeleteFolder }) {

  const [hovered, setHovered] = useState(false)

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 hover:text-dark-charcoal ${isActive ? "font-bold text-dark-charcoal" : "text-dim-gray"}`
      }

      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>
        <button className='mr-4' onClick={() => onDeleteFolder(folder)}>
          {hovered ? < Trash2 size={16} /> : count}
        </button>
      </div>
    </NavLink>
  )
}

