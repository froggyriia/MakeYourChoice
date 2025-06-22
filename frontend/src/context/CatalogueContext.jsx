/**
 * CatalogueContext.jsx
 *
 * This file defines a React Context to globally provide state and logic related to:
 * - Course catalogue management
 * - Academic programs
 * - Exporting data to Excel
 *
 * It wraps children components with shared access to these features via hooks:
 * - `useCatalogue` → handles course list and course-related actions
 * - `usePrograms` → manages program creation and modals
 * - `useExcelExport` → enables exporting table data to Excel
 *
 * Usage:
 * Wrap your app (or component subtree) with <CatalogueProvider> to access this state.
 * Use `useCatalogueContext()` to access all tools via a single hook.
 */

import React, { createContext, useContext } from 'react';
import { useCatalogue } from '../hooks/useCatalogue'; // Custom hook for managing course data
import { usePrograms } from '../hooks/usePrograms';   // Custom hook for managing academic programs
import { useExcelExport } from '../hooks/useExcelExport'; // Custom hook for exporting data to Excel

// Create a new context to hold catalogue-related logic and state
const CatalogueContext = createContext(null);

/**
 * CatalogueProvider
 *
 * Wraps child components and injects shared catalogue-related hooks via context.
 *
 * @param {React.ReactNode} children - Any nested components that need access to catalogue state.
 * @returns {JSX.Element} A context provider with catalogue, programs, and export logic.
 */
export const CatalogueProvider = ({ children }) => {
    // Load catalogue data and functions
    const catalogue = useCatalogue();

    // Load program management logic (modals, creation, etc.)
    const programs = usePrograms();

    // Load Excel export handlers
    const excelExport = useExcelExport();

    // Provide all of them through context to consuming components
    return (
        <CatalogueContext.Provider value={{ catalogue, programs, excelExport }}>
            {children}
        </CatalogueContext.Provider>
    );
};

/**
 * useCatalogueContext
 *
 * Custom hook for accessing the catalogue context from any component.
 * Must be used within a CatalogueProvider wrapper.
 *
 * @returns {{ catalogue, programs, excelExport }} Object containing all catalogue tools.
 */
export const useCatalogueContext = () => useContext(CatalogueContext);
