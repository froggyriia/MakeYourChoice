import { describe, it, expect } from 'vitest';
import { createAbbreviation } from '../../../src/hooks/useExcelExport';

describe('createAbbreviation', () => {
  it('should generate correct abbreviations', () => {
    const result = createAbbreviation('Branding & Marketing in IT Industry');
    expect(result).toBe('BMIII');
  });
});
