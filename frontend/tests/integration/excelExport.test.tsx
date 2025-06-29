import React from 'react';
import { render, act } from '@testing-library/react';
import { vi, describe, it, beforeAll, afterAll, expect } from 'vitest';
import { useExcelExport } from '../../src/hooks/useExcelExport';
import { supabase } from '../../src/pages/supabaseClient.jsx';
import ExcelJS from 'exceljs';

vi.mock('../../src/pages/supabaseClient.jsx');
vi.mock('exceljs');

let exportToExcelFn: () => Promise<void>;

const realCreateElement = document.createElement;

async function waitUntilReady() {
  for (let i = 0; i < 20; i++) {
    if (exportToExcelFn) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error('exportToExcelFn not ready after timeout');
}

describe('Excel Export Integration', () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn();

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return {
          click: vi.fn(),
          href: '',
          setAttribute: vi.fn(),
          style: {},
          download: '',
          remove: vi.fn(),
        } as unknown as HTMLAnchorElement;
      }
      return realCreateElement.call(document, tagName);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should generate Excel with correct structure', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [
        { priority: 'High', value: 1 },
        { priority: 'Low', value: 0 },
      ],
      error: null,
    });
    supabase.from.mockReturnValue({ select: mockSelect });

    const mockWorksheet = {
      columns: [],
      addRow: vi.fn(),
    };
    const mockWorkbook = {
      addWorksheet: vi.fn(() => mockWorksheet),
      xlsx: {
        writeBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
      },
    };
    ExcelJS.Workbook.mockImplementation(() => mockWorkbook);

    function TestComponent() {
      const { exportToExcel } = useExcelExport();
      exportToExcelFn = exportToExcel;
      return null;
    }

    render(<TestComponent />);
    await waitUntilReady();

    await act(async () => {
      await exportToExcelFn();
    });

    expect(supabase.from).toHaveBeenCalledWith('priorities');
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('Priorities');
    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('Legend');
    expect(mockWorkbook.xlsx.writeBuffer).toHaveBeenCalled();
  });
});
