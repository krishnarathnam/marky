import React from 'react'
import Category from './Category'
import Folders from './Folders'

export default function Files({ folderNoteCounts, onDeleteFolder, openModal, setFolders, folders }) {
  return (
    <div className='w-full overflow-x-hidden h-full space-y-4 text-sm '>
      <Category />
      <Folders folderNoteCounts={folderNoteCounts} openModal={openModal} onDeleteFolder={onDeleteFolder} setFolders={setFolders} folders={folders} />
    </div>
  )
}

