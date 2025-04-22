import React, { useEffect, useState } from "react";
export default function Header() {
  const [qoute, setQoute] = useState({})

  useEffect(() => {
    const fetchQoutes = async () => {
      let gotIt = false
      while (!gotIt) {
        try {
          const res = await fetch("https://thequoteshub.com/api/random-qoute");
          const data = await res.json();
          console.log(data)
          if (data.text.length < 100) {
            setQoute({ qoute: data.text, author: data.author })
            return;
          } else {
            gotIt = false;
            console.log("Text to long gang");
          }
        } catch (error) {
          console.error(error);
          return;
        }
      }
    }

    fetchQoutes();
  }, []);

  return (
    <nav className="border-b-1 border-[#d0cfcf] h-50 flex flex-col mb-5">
      <div className="flex justify-between items-center">
        <div className="p-4 pt-6 pb-4 flex flex-col">
          <img src="https://picsum.photos/200" className="h-15 w-15 rounded-full" />
          <p className="text-xs pt-5 text-dim-gray">{qoute.qoute}</p>
          <p className="text-xs text-off-black font-bold pt-2">- {qoute.author}</p>
        </div>
      </div>
    </nav>
  );
}

