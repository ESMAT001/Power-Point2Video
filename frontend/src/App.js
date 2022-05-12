import { useEffect } from 'react'
import { DataContextProvider } from "./components/Context/DataContext"
import FileSelector from "./components/FileSelector"
import TextInput from "./components/TextInput"
import Slides from "./components/Slides"
import DownloadBtn from "./components/DownloadBtn"
import Status from "./components/Status"
import { apiBaseUrl } from './utils'

function App() {

  useEffect(() => {

    window.addEventListener('beforeunload', () => {

      const id = localStorage.getItem('id')
      if (id) {
        fetch(apiBaseUrl + `delete/${id}`)
      }

    })
  }, [])

  return (
    <DataContextProvider>
      <main
        className="flex flex-col items-center p-10 space-y-10"
      >
        <FileSelector />
        <Status />
        <div className="flex justify-between w-full">
          <TextInput />
          <DownloadBtn />
        </div>
        <Slides />
      </main>
    </DataContextProvider>
  )
}

export default App