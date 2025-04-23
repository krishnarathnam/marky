import React from 'react'
import { Link } from 'react-router';

export default function Files({changeIndex, indexs}) {
    const navItems = [
        "home",
        "notes",
    ];


    return (
        <div className="w-60 bg-off-white px-4 border-r overflow-y-auto ">
            <ul className="space-y-2">
                {navItems.map((item, index) => (
                    <Link to={item}>
                    <button
                        key={index}
                        className={`text-sm block w-full px-3 py-2 rounded-l cursor-pointer 
                                ${index === indexs
                                ? "bg-white text-off-black font-medium shadow-sm"
                                : "text-dim-gray hover:text-off-black hover:bg-gray-100"
                            }`}
                        onClick={() => changeIndex(index)}
                    >
                        {item}
                    </button>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
