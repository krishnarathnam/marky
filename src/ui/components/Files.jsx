import React from 'react'
import Category from './Category'
import Folders from './Folders'

export default function Files({ onDeleteFolder, openModal, setFolders, folders }) {
  return (
    <div className='w-full overflow-x-hidden h-full space-y-4 text-sm '>
      <Category />
      <Folders openModal={openModal} onDeleteFolder={onDeleteFolder} setFolders={setFolders} folders={folders} />
    </div>
  )
}

