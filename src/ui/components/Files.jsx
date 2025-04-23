import React from 'react'

export default function Files({changeIndex, indexs}) {
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
        "Quantum computing",
        "Quantum computing",
        "Quantum computing",
    ];


    return (
        <div className="w-60 bg-off-white px-4 border-r overflow-y-auto ">
            <ul className="space-y-2">
                {navItems.map((item, index) => (
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
                ))}
            </ul>
        </div>
    )
}
