import { Star, Clock, Box, } from "lucide-react";
import SidebarLink from './SidebarLink'

export default function Category() {

  return (
    <div>
      <div className='select-none flex-col space-y-2 flex ml-3'>
        <SidebarLink to="/category/all" icon={<Box size={16} />} label="All Notes" />
        <SidebarLink to="/category/recent" icon={<Clock size={16} />} label="Recently" />
        <SidebarLink to="/category/important" icon={<Star size={16} />} label="Important" />
      </div>
    </div>
  )
}

