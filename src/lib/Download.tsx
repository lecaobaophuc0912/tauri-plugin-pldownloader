import React, { useState } from 'react'
import { invoke } from "@tauri-apps/api/core"
import { ping, downloadPrivate, downloadPublic, copyFilePath } from '../../../../dist-js';
import { shareFile } from 'tauri-plugin-share';

function Download() {
  const [url, setUrl] = useState("")
  const [downloadMsg, setDownloadMsg] = useState("")

  const getNameFromUrl = (url: string) => {
    return url.split("/").pop()
  }


  const handleDownloadPublic = async () => {
    try {
      const res = await downloadPublic({ url, fileName: getNameFromUrl(url) })
      setDownloadMsg(res.path || res.uri || "")
    } catch (error) {
      console.error(error)
    }
  }

  const handleSharePrivate = async () => {
    try {
      const res = await downloadPrivate({ url, fileName: getNameFromUrl(url) })
      if (res.path) {
        await shareFile(res.path as string, "image/png")
      }
      setDownloadMsg(res.uri || res.path || "")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full">
      <div className="row w-full" style={{ width: '100%' }}>
        <textarea
          rows={10}
          style={{ width: '100%' }}
          id="greet-input"
          placeholder="Enter a url...."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: '10px' }}>
        <button onClick={handleDownloadPublic}>Download (Public)</button>
        <button onClick={handleSharePrivate}>Share (Private)</button>
      </div>
      <p>{downloadMsg}</p>
    </div>
  )
}

export default Download
