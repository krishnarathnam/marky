import React from 'react'

export default function Files() {
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
        <div className="w-60 bg-off-white px-4 border-r overflow-y-auto ">
            <ul className="space-y-2">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={`text-sm block w-full px-3 py-2 rounded-l cursor-pointer 
            ${index === 1
                                ? "bg-white text-off-black font-medium shadow-sm"
                                : "text-dim-gray hover:text-off-black hover:bg-gray-100"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </ul>
        </div>
    )
}
