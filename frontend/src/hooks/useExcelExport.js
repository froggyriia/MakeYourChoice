/**
 * useExcelExport.js
 *
 * This custom React hook is used to **export data from a Supabase table (`priorities`) into an Excel file (.xlsx)**.
 * It retrieves data using Supabase, processes it with ExcelJS, and triggers a download in the browser.
 * It exposes an `exportToExcel` function and an `isExported` state flag to indicate completion.
 */

import { useState } from 'react';
import ExcelJS from 'exceljs';
import { supabase } from '../pages/supabaseClient.jsx';

/**
 * Custom hook to manage Excel export functionality from Supabase data.
 *
 * @returns {{
 *   isExported: boolean,
 *   exportToExcel: () => Promise<void>
 * }} An object containing export state and export trigger function.
 */
export function useExcelExport() {
    // State to track whether export was completed
    const [isExported, setIsExported] = useState(false);
    /**
     * Exports data from the "priorities" Supabase table into an Excel file.
     *
     * @async
     * @returns {Promise<void>} Resolves when the file is successfully generated and download is triggered.
     * @throws Will alert and log any Supabase or file creation errors.
     */
    const exportToExcel = async () => {
        try {
            // Fetch all data from the 'priorities' table
            const { data, error } = await supabase.from("priorities").select("*");
            if (error) throw error;
            // If there is no data, alert the user and exit
            if (!data?.length) {
                alert("No data to export");
                return;
            }
            // Create a new Excel workbook and worksheet
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Priorities");
            // Add header row using object keys
            const headers = Object.keys(data[0]);
            worksheet.addRow(headers);
            data.forEach(row => worksheet.addRow(Object.values(row)));

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `priorities_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
            link.click();
            URL.revokeObjectURL(link.href);
            // Mark export as complete
            setIsExported(true);
        } catch (error) {
            console.error("Error while exporting...", error);
            alert("Error occurred when the file was creating");
        }
    };
    // Return the export trigger function and state flag
    return { isExported, exportToExcel };
}
