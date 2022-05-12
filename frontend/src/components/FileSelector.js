
import { useRef, memo } from "react"
import { useDataContext } from "./Context/DataContext"
import { apiBaseUrl } from '../utils'

function FileSelector() {
    const fileSelectorRef = useRef()
    const [_, setState] = useDataContext()

    async function handleFileSelectorChange() {
        const file = fileSelectorRef.current.files[0]

        if (!file) return;

        const fileExtension = file.name.split('.').pop()

        let endPoint = 'ppt2png'

        switch (fileExtension) {
            case "ppt":
            case 'pptx':
                endPoint = 'ppt2png'
                break;
            case "pdf":
                endPoint = 'pdf2png'
                break;
            default:
                return;
        }


        setState(prev => ({ ...prev, loading: true }))

        const formData = new FormData()
        formData.append("file", file)
        try {
            const response = await fetch(apiBaseUrl + endPoint, {
                method: "POST",
                body: formData
            })
            const data = await response.json()

            localStorage.setItem('id', data.id)

            setState(prevState => ({ ...prevState, ...data, loading: false }))
        } catch (error) {
            setState(prevState => ({ ...prevState, error: error.message, loading: false }))
        }


    }
    
    return (
        <div>
            <input
                ref={fileSelectorRef}
                type='file'
                accept=" application/vnd.ms-powerpoint,.ppt, .pptx"
                onChange={handleFileSelectorChange}
            />
        </div>
    )
}

export default memo(FileSelector)