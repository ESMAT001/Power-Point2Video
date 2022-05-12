import { useDataContext } from './Context/DataContext'
function Status() {
    const [{ loading, error }] = useDataContext();
    return (
        <>
            {loading && <h1 className='font-3xl font-bold text-blue-600'>loading...</h1>}
            {error && <h1 className='font-3xl font-bold text-red-600'>{error}</h1>}
        </>
    )
}

export default Status