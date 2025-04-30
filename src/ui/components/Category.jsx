import React from 'react'
import { Star, Clock, Box, Bookmark } from "lucide-react";
import SidebarLink from './SidebarLink'

export default function Category() {

  return (
    <div>
      <h3 className="uppercase ml-3 font-bold text-sm mb-2"><span><Bookmark size={16} className={"inline"} /></span> Category</h3>
      <div className="space-y-2 ml-6">
        <SidebarLink to="/category/all" icon={<Box size={16} />} label="All Notes" />
        <SidebarLink to="/category/recent" icon={<Clock size={16} />} label="Recently" />
        <SidebarLink to="/category/important" icon={<Star size={16} />} label="Important" />
      </div>
    </div>
  )
}

