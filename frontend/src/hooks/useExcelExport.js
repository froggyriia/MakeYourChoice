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
     * creates an abbreviation from a course name by taking the first letter of each word.
     * handles various word separators (spaces, hyphens, colons) and eng/ru characters.
     *
     * @param {string} name - the full course name to abbreviate
     * @returns {string} the generated abbreviation or original input if invalid
     */
    export const createAbbreviation = (name) => {
        if (!name || typeof name !== 'string') return name;

        return name
            .split(/[\s-:]+/)
            .map(word => word.match(/^[a-zA-Zа-яА-Я]/)?.[0]?.toUpperCase() || '')
            .filter(Boolean)
            .join('');
    };

export function useExcelExport() {
    const [isExported, setIsExported] = useState(false);

    const exportToExcel = async () => {
        try {
            // Fetch data from both tables
            const [{ data: prioritiesData, error: prioritiesError },
                   { data: lastPrioritiesData, error: lastPrioritiesError }] = await Promise.all([
                supabase.from("priorities").select("*"),
                supabase.from("last_priorities").select("*")
            ]);

            if (prioritiesError || lastPrioritiesError) {
                throw prioritiesError || lastPrioritiesError;
            }

            if (!prioritiesData?.length && !lastPrioritiesData?.length) {
                alert("No data to export");
                return;
            }

            // Process data and collect all course names
            const allCourses = new Set();

            const processRow = (row) => {
                const newRow = { ...row };
                for (let i = 1; i <= 5; i++) {
                    const humKey = `hum${i}`;
                    const techKey = `tech${i}`;

                    if (newRow[humKey]) {
                        allCourses.add(newRow[humKey]);
                        newRow[humKey] = createAbbreviation(newRow[humKey]);
                    }
                    if (newRow[techKey]) {
                        allCourses.add(newRow[techKey]);
                        newRow[techKey] = createAbbreviation(newRow[techKey]);
                    }
                }
                return newRow;
            };

            const processedPriorities = prioritiesData?.map(processRow) || [];
            const processedLastPriorities = lastPrioritiesData?.map(processRow) || [];

            // Create workbook and sheets
            const workbook = new ExcelJS.Workbook();

            // Priorities sheet
            if (processedPriorities.length > 0) {
                const prioritiesSheet = workbook.addWorksheet("Priorities");
                const headers = Object.keys(processedPriorities[0]);
                prioritiesSheet.addRow(headers);
                processedPriorities.forEach(row => {
                    prioritiesSheet.addRow(Object.values(row));
                });
            }

            // Last Priorities sheet
            if (processedLastPriorities.length > 0) {
                const lastPrioritiesSheet = workbook.addWorksheet("Last Priorities");
                const headers = Object.keys(processedLastPriorities[0]);
                lastPrioritiesSheet.addRow(headers);
                processedLastPriorities.forEach(row => {
                    lastPrioritiesSheet.addRow(Object.values(row));
                });
            }

            // Legend sheet (only if we have any courses)
            if (allCourses.size > 0) {
                const legendSheet = workbook.addWorksheet("Legend");
                legendSheet.columns = [
                    { header: "Full Name", key: "full", width: 40 },
                    { header: "Abbreviation", key: "abbr", width: 15 }
                ];

                Array.from(allCourses)
                    .sort()
                    .forEach(course => {
                        legendSheet.addRow({
                            full: course,
                            abbr: createAbbreviation(course)
                        });
                    });
            }

            // Generate and download the file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `priorities_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 100);

            setIsExported(true);
        } catch (error) {
            console.error("Export error:", error);
            alert("Error occurred: " + error.message);
        }
    };

    return { isExported, exportToExcel };
}