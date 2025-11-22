import React, { createContext, useState, useContext } from 'react';

const DiagnosisContext = createContext();

export const DiagnosisProvider = ({ children }) => {
    const [diagnosis, setDiagnosis] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <DiagnosisContext.Provider value={{ diagnosis, setDiagnosis, isChatOpen, setIsChatOpen }}>
            {children}
        </DiagnosisContext.Provider>
    );
};

export const useDiagnosis = () => useContext(DiagnosisContext);
