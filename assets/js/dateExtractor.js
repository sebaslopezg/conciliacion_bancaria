class DateExtractor {
  constructor(config = {}) {
    this.config = {
      // Default regex pattern for "al DD MONTH YYYY" format
      pattern: config.pattern || /al\s+(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})/i,
      
      // Default month mappings for Spanish
      monthMap: config.monthMap || {
        'enero': '01', 'ene': '01',
        'febrero': '02', 'feb': '02',
        'marzo': '03', 'mar': '03',
        'abril': '04', 'abr': '04',
        'mayo': '05', 'may': '05',
        'junio': '06', 'jun': '06',
        'julio': '07', 'jul': '07',
        'agosto': '08', 'ago': '08',
        'septiembre': '09', 'sep': '09',
        'octubre': '10', 'oct': '10',
        'noviembre': '11', 'nov': '11',
        'diciembre': '12', 'dic': '12'
      },
      
      // Output format
      outputFormat: config.outputFormat || 'DD/MM/YYYY',
      
      // Capture group indices (which groups contain day, month, year)
      captureGroups: config.captureGroups || {
        day: 1,
        month: 2,
        year: 3
      },
      
      // Enable logging for debugging
      debug: config.debug || false
    };
  }

  extractAndFormatDate(cellValue) {
    if (!cellValue || typeof cellValue !== 'string') {
      return null;
    }

    const match = cellValue.match(this.config.pattern);
    
    if (!match) {
      if (this.config.debug) {
        console.log(`No match found for: "${cellValue}"`);
      }
      return null;
    }

    if (this.config.debug) {
      console.log(`Match found:`, match);
    }

    // Extract parts using configured capture groups
    const dayRaw = match[this.config.captureGroups.day];
    const monthRaw = match[this.config.captureGroups.month];
    const yearRaw = match[this.config.captureGroups.year];

    if (!dayRaw || !monthRaw || !yearRaw) {
      if (this.config.debug) {
        console.warn(`Missing date parts: day=${dayRaw}, month=${monthRaw}, year=${yearRaw}`);
      }
      return null;
    }

    // Process day
    const day = dayRaw.padStart(2, '0')
    
    // Process month
    const monthName = monthRaw.toLowerCase();
    const month = this.config.monthMap[monthName];
    
    if (!month) {
      if (this.config.debug) {
        console.warn(`Unknown month: ${monthName}`);
      }
      return null;
    }
    
    // Process year
    const year = yearRaw;
    
    // Format output based on configuration
    return this.formatDate(day, month, year);
  }

  formatDate(day, month, year) {
    const format = this.config.outputFormat;
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
      .replace('YY', year.slice(-2));
  }

  // Method to update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  // Method to process Excel cell with SheetJS
  processExcelCell(worksheet, cellAddress) {
    const cell = worksheet[cellAddress];
    
    if (!cell || !cell.v) {
      return null;
    }
    
    const cellValue = cell.v.toString();
    return this.extractAndFormatDate(cellValue);
  }
}

// Factory function for common configurations
function createDateExtractor(type = 'default') {
  const configurations = {
    // Default Spanish "al" pattern
    default: {},
    
    // Pattern for "hasta DD MONTH YYYY"
    hasta: {
      pattern: /hasta\s+(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})/i
    },
    
    // Pattern for "DD de MONTH de YYYY"
    deDe: {
      pattern: /(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i
    },
    
    // Pattern for "MONTH DD, YYYY" (English)
    english: {
      pattern: /([a-z]+)\s+(\d{1,2}),\s+(\d{4})/i,
      captureGroups: { day: 2, month: 1, year: 3 },
      monthMap: {
        'january': '01', 'jan': '01',
        'february': '02', 'feb': '02',
        'march': '03', 'mar': '03',
        'april': '04', 'apr': '04',
        'may': '05',
        'june': '06', 'jun': '06',
        'july': '07', 'jul': '07',
        'august': '08', 'aug': '08',
        'september': '09', 'sep': '09',
        'october': '10', 'oct': '10',
        'november': '11', 'nov': '11',
        'december': '12', 'dec': '12'
      }
    },
    
    // US format MM/DD/YYYY
    us: {
      outputFormat: 'MM/DD/YYYY'
    }
  };

  return new DateExtractor(configurations[type] || configurations.default);
}

// Example usage:

// 1. Default configuration (Spanish "al" pattern)
const defaultExtractor = new DateExtractor();
console.log(defaultExtractor.extractAndFormatDate("CANCELA AL 31 AGO 2025")); // "31/08/2025"

// 2. Custom regex pattern
const customExtractor = new DateExtractor({
  pattern: /hasta\s+(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})/i,
  debug: true
});
console.log(customExtractor.extractAndFormatDate("Vence hasta 15 diciembre 2024")); // "15/12/2024"

// 3. Different output format
const usFormatExtractor = new DateExtractor({
  outputFormat: 'MM/DD/YYYY'
});
console.log(usFormatExtractor.extractAndFormatDate("al 31 ago 2025")); // "08/31/2025"

// 4. English dates with different capture group order
const englishExtractor = createDateExtractor('english');
console.log(englishExtractor.extractAndFormatDate("July 4, 2024")); // "04/07/2024"

// 5. Update configuration dynamically
const extractor = new DateExtractor();
extractor.updateConfig({
  pattern: /(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i,
  outputFormat: 'YYYY-MM-DD'
});
console.log(extractor.extractAndFormatDate("25 de marzo de 2024")); // "2024-03-25"

// 6. Using with SheetJS
/*
import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('your-file.xlsx');
const worksheet = workbook.Sheets['Sheet1'];

const extractor = new DateExtractor({
  debug: true,
  outputFormat: 'YYYY-MM-DD'
});

const formattedDate = extractor.processExcelCell(worksheet, 'A1');
console.log(formattedDate);
*/