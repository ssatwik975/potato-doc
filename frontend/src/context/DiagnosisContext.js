import React, { createContext, useState, useContext } from 'react';

const DiagnosisContext = createContext();

export const DiagnosisProvider = ({ children }) => {
    const [diagnosis, setDiagnosis] = useState(null);

    return (
        <DiagnosisContext.Provider value={{ diagnosis, setDiagnosis }}>
            {children}
        </DiagnosisContext.Provider>
    );
};

export const useDiagnosis = () => useContext(DiagnosisContext);
