import React from 'react'
import { NavLink } from 'react-router';
import { Folder, Star, Share2, Clock, Box, Hash, Plus } from "lucide-react";
import Category from './Category'
import Folders from './Folders'

export default function Files() {
     

     return (
        <div className='w-full h-full space-y-6 text-sm '>
            <Category />
            <Folders />
        </div>
    )
}

