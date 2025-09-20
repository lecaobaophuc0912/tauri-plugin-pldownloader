import { useState } from 'react'
import { downloadPrivate, downloadPublic, saveFilePrivateFromPath, saveFilePublicFromPath } from '../../../../dist-js';
import { shareFile } from 'tauri-plugin-share';

function Download() {
  const [url, setUrl] = useState("https://s3-api-file.mojo.vn/app/36d2a19d-7226-4e35-a622-33e146077b32-x2ogqa.png")
  const [downloadMsg, setDownloadMsg] = useState("")

  const getNameFromUrl = (url: string) => {
    return url.split("/").pop()
  }

  const getExtension = (fileName: string) => {
    return fileName.split(".").pop()
  }
  const mapExtensionToMimeType = (extension: string): string => {
    const mimeTypeMap: Record<string, string> = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      gif: 'image/gif',
      bmp: 'image/bmp',
      tiff: 'image/tiff',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      txt: 'text/plain',
      html: 'text/html',
      css: 'text/css',
      js: 'text/javascript',
      json: 'application/json',
      xml: 'application/xml',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogv: 'video/ogg',
    };

    return mimeTypeMap[extension.toLowerCase()] || 'application/octet-stream';
  };



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
      const fileName = getNameFromUrl(url) || '';
      const res = await downloadPrivate({ url, fileName })
      if (res.path) {
        await shareFile(res.path as string, mapExtensionToMimeType(getExtension(fileName) || ''))
      }
      setDownloadMsg(res.uri || res.path || "")
    } catch (error) {
      console.error(error)
    }
  }

  const handleSavePublicFromPath = async () => {
    try {
      const name = getNameFromUrl(url) || 'download'
      const resFetch = await fetch(url)
      const blob = await resFetch.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const res = await saveFilePublicFromPath({ data: arrayBuffer, fileName: name, mimeType: blob.type || undefined })
      console.log('res', res)
      setDownloadMsg(res.path || res.uri || '')
    } catch (error) {
      console.error(error)
    }
  }

  const handleSavePrivateFromPath = async () => {
    try {
      const name = getNameFromUrl(url) || 'download';
      const resFetch = await fetch(url)
      const blob = await resFetch.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const res = await saveFilePrivateFromPath({ data: arrayBuffer, fileName: name });
      console.log('res', res);
      setDownloadMsg(res.path || res.uri || '');
      if (res.path) {
        await shareFile(res.path as string, mapExtensionToMimeType(getExtension(name) || ''))
      }
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
        <button onClick={handleSavePublicFromPath}>Save Public From ArrayBuffer</button>
        <button onClick={handleSavePrivateFromPath}>Save Private From ArrayBuffer</button>
      </div>
      <p>{downloadMsg}</p>
    </div>
  )
}

export default Download
