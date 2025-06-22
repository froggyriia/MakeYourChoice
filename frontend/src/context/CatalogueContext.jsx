import React, { createContext, useContext } from 'react';
import { useCatalogue } from '../hooks/useCatalogue';
import { usePrograms } from '../hooks/usePrograms';
import { useExcelExport } from '../hooks/useExcelExport';

const CatalogueContext = createContext(null);

export const CatalogueProvider = ({ children }) => {

    const catalogue = useCatalogue();
    const programs = usePrograms();
    const excelExport = useExcelExport();

    return (
        <CatalogueContext.Provider value={{ catalogue, programs, excelExport }}>
            {children}
        </CatalogueContext.Provider>
    );
};

export const useCatalogueContext = () => useContext(CatalogueContext);
