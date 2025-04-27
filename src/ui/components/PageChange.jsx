import { useEffect } from "react";
import { useParams } from "react-router-dom"

export default function PageChange({ setLinkFolderName }) {
  const { LinkFolderName } = useParams();
  useEffect(() => {
    setLinkFolderName(LinkFolderName)
  }, [LinkFolderName])
  return (
    <div>PageChange</div>
  )
}

