import { useState, useEffect, memo } from 'react'
import { useDataContext } from './Context/DataContext'
import { credentials, textToSpeechApiBaseUrl } from '../utils'

function TextInput() {
    const [globalState, setGlobalState] = useDataContext()
    const { currentSlide } = globalState
    const [value, setValue] = useState("")
    const [transcriptionId, setTranscriptionId] = useState(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!transcriptionId) return;

        const options = {
            headers: {
                Authorization: credentials.secretKey,
                "X-User-ID": credentials.useId
            }
        }

        const intervalId = setInterval(async () => {

            const response = await fetch(textToSpeechApiBaseUrl + `articleStatus?transcriptionId=${transcriptionId}`, options)
            const data = await response.json()

            if (data?.error) {
                setGlobalState(prevState => ({ ...prevState, error: data.errorMessage }))
                setSaving(false)
                clearInterval(intervalId)
                return;
            }

            if (!data.converted) return;

            clearInterval(intervalId)

            const { audioUrl, audioDuration } = data

            setGlobalState(prevState => ({
                ...prevState,
                slides: prevState.slides.map(slide => {
                    if (slide.slide === prevState.currentSlide) {
                        return {
                            ...slide,
                            voice: audioUrl,
                            audioDuration
                        }
                    }
                    return slide
                })
            }))
            setTranscriptionId(null)
            setSaving(false)
        }, 1000)
    }, [transcriptionId])


    async function handleClick() {
        try {
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: credentials.secretKey,
                    "X-User-ID": credentials.useId
                },
                method: "POST",
                body: JSON.stringify({
                    "voice": 'Salli',
                    "content": [value],
                })
            }

            setSaving(true)

            let response = await fetch(textToSpeechApiBaseUrl + "convert", options)
            let data = await response.json()

            if (data.status === 'error') new Error(data.error);
            setTranscriptionId(data.transcriptionId)

        } catch (error) {
            setGlobalState(prevState => ({
                ...prevState,
                error: error.message
            }))
            setSaving(false)
        }

    }

    return (
        <>
            {currentSlide && <div>
                <input
                    type='text'
                    placeholder='write yout text here'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="border-2  p-2 mr-2"
                />
                {<button
                    disabled={!value || saving}
                    onClick={handleClick}
                    className={`bg-green-400 text-white py-2 px-3 shadow ${!value || saving ? 'opacity-50' : ''}`}
                >
                    {saving ? 'Saving...' : 'Save'}
                </button>}
            </div>}
        </>
    )
}

export default memo(TextInput)