import { Settings } from 'lucide-react'

export default function Header() {

  return (
    <nav className="border-b-1 border-[#d0cfcf] rounded-md shadow-2xs flex flex-col mb-5">
      <div className="flex justify-between p-3 pb-5 mt-2 items-center">
        <div>
          <h3 className='font-bold text-dim-gray text-m'>Krishna Rathnam</h3>
          <p className='text-xs text-dim-gray'>Last worked at 10:22:23</p>
        </div>
        <Settings size={18} className='text-dim-gray' />
      </div>
    </nav>
  );
}

