import { createContext, useContext, useState, useMemo } from "react";

export const initialValue = {
    slides: [],
    loading: false,
    currentSlide: null,
    error: null,
    id:null,
}

const DataContext = createContext();


function DataContextProvider({ children }) {
    const [state, setState] = useState(initialValue)
    const value = useMemo(() => ([state, setState]), [state]);
    return <DataContext.Provider value={value} >
        {children}
    </DataContext.Provider>
}

function useDataContext() {
    const [state, setState] = useContext(DataContext)
    const value = useMemo(() => ([state, setState]), [state]);
    return value
}

export default DataContext
export {
    DataContextProvider,
    useDataContext
}
