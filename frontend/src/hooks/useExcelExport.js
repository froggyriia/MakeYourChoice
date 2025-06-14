import { useState } from 'react';
import ExcelJS from 'exceljs';
import { supabase } from '../pages/supabaseClient';

export function useExcelExport() {
    const [isExported, setIsExported] = useState(false);

    const exportToExcel = async () => {
        try {
            const { data, error } = await supabase.from("priorities").select("*");
            if (error) throw error;

            if (!data?.length) {
                alert("Нет данных для экспорта");
                return;
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Priorities");
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

            setIsExported(true);
        } catch (error) {
            console.error("Ошибка при экспорте:", error);
            alert("Произошла ошибка при создании файла");
        }
    };

    return { isExported, exportToExcel };
}
