import { memo } from 'react'
import { useDataContext } from './Context/DataContext'


function Slides() {
    const [globalState, setGlobalState] = useDataContext()
    return (
        <div className='flex flex-wrap w-screen border'>
            {globalState.slides.map((slide) => {
                return (
                    <div
                        onClick={() => setGlobalState({ ...globalState, currentSlide: slide.slide })}
                        key={`slide-${slide.slide}`}
                        className={`w-60 ${globalState.currentSlide === slide.slide ? 'border-4 border-blue-500' : 'border-2'} w-1/3`}
                    >
                        <img className={`w-full ${!slide.voice ? 'opacity-50 border-4 border-red-500 rounded' : ''}`} src={slide.image} alt={slide.slide} />

                    </div>
                )
            })}
        </div>
    )
}

export default memo(Slides)