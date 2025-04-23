import React from 'react'
import { Link } from 'react-router';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';
export default function Files({changeIndex, indexs}) {
    const navItems = [
        {name: "All Notes", id:'allnotes'},
        {name: "Pinned Notes", id:'pnotes'},
    ];


    return (
        <div className="w-60 bg-off-white px-4 border-r overflow-y-auto ">
            <ul className="space-y-2">
            <ChevronDown/>
            <Plus />
            <Trash2 />
            <ChevronRight/>
                {navItems.map(({name, id}) => (
                    <Link to={id}>
                    <button
                        key={id}
                        className={`text-sm block w-full px-3 py-2 rounded-l cursor-pointer 
                                ${id === indexs
                                ? "bg-white text-off-black font-medium shadow-sm"
                                : "text-dim-gray hover:text-off-black hover:bg-gray-100"
                            }`}
                        onClick={() => changeIndex(id)}
                    >
                        {name}
                    </button>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
