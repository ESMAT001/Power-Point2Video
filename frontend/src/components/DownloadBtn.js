
import { useState } from 'react'
import { useDataContext, initialValue } from './Context/DataContext'
import { apiBaseUrl } from '../utils'
import fileDownload from 'js-file-download'

function DownloadBtn() {
  const [globalState, setGlobalState] = useDataContext()
  const [downloading, setDownloading] = useState(false)

  async function handleClick() {
    try {

      const { id, audioDuration } = globalState
      setDownloading(true)

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          audioDuration,
          voices: globalState.slides.map(slide => ({ voice: slide.voice, audioDuration: slide.audioDuration })),
        })
      }

      const response = await fetch(apiBaseUrl + `png2video/${id}`, options)
      const blob = await response.blob()
      fileDownload(blob, `vidoe.mp4`)

      await setGlobalState(initialValue)
      setDownloading(false)
    } catch (error) {
      setGlobalState({ ...globalState, error: error.message })
      setDownloading(false)
    }
  }
  const slidesLength = globalState.slides.length
  const voiceLength = globalState.slides.filter(slide => slide.voice !== "").length

  return (
    <>
      {slidesLength === voiceLength && slidesLength !==0  && <button
        disabled={downloading}
        className={`bg-red-500 text-white font-bold py-3 px-4 shadow ${downloading ? 'opacity-50' : ''}`}
        onClick={handleClick}
      >
        {downloading ? 'Downloading...' : 'Download'}
      </button>}
    </>

  )
}

export default DownloadBtn