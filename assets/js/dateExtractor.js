class DateExtractor {
  constructor(config = {}) {
    this.config = {
      // Default regex pattern for "al DD MONTH YYYY" format
      pattern: config.pattern ? new RegExp(config.pattern, 'i') : /al\s+(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})/i,
      
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
    const day = dayRaw.padStart(2, '0');
    
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

  // Method to set regex pattern from simple text
  setPatternFromSimpleText(patternText) {
    try {
      // Escape special regex characters except spaces
      let processedPattern = patternText
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/\+/g, '\\+')
        .replace(/\*/g, '\\*')
        .replace(/\?/g, '\\?')
        .replace(/\^/g, '\\^')
        .replace(/\$/g, '\\$')
        .replace(/\|/g, '\\|');
      
      // Replace placeholders with capture groups
      processedPattern = processedPattern
        .replace(/DD/g, '(\\d{1,2})')
        .replace(/MONTH/g, '([a-záéíóúñ]+)')
        .replace(/YYYY/g, '(\\d{4})');
      
      // Replace spaces with flexible space matching
      processedPattern = processedPattern.replace(/\s+/g, '\\s+');
      
      // Make the pattern flexible to match anywhere in the text
      processedPattern = '.*?' + processedPattern;
      
      this.config.pattern = new RegExp(processedPattern, 'i');
      
      if (this.config.debug) {
        console.log(`Original: "${patternText}"`);
        console.log(`Processed: "${processedPattern}"`);
        console.log(`Final regex: ${this.config.pattern}`);
      }
      return true;
    } catch (error) {
      if (this.config.debug) {
        console.error(`Invalid pattern: ${patternText}`, error);
      }
      return false;
    }
  }

  // Method to set exact regex pattern from input text
  setPatternFromText(patternText) {
    try {
      this.config.pattern = new RegExp(patternText, 'i');
      if (this.config.debug) {
        console.log(`Pattern updated to: ${this.config.pattern}`);
      }
      return true;
    } catch (error) {
      if (this.config.debug) {
        console.error(`Invalid regex pattern: ${patternText}`, error);
      }
      return false;
    }
  }

  // Method to update configuration
  updateConfig(newConfig) {
    if (newConfig.pattern && typeof newConfig.pattern === 'string') {
      newConfig.pattern = new RegExp(newConfig.pattern, 'i');
    }
    this.config = { ...this.config, ...newConfig };
  }
}
/*

// Example usage:

// 1. Default usage
console.log('=== Default patterns ===');
const defaultExtractor = new DateExtractor();
console.log(defaultExtractor.extractAndFormatDate("CANCELA AL 31 AGO 2025")); // "31/08/2025"
console.log(defaultExtractor.extractAndFormatDate("Quincena al 31 Agosto 2025")); // "31/08/2025"

// 2. Simple patterns that now work correctly
console.log('\n=== Simple patterns ===');
const simpleExtractor = new DateExtractor({ debug: true });
simpleExtractor.setPatternFromSimpleText("DD MONTH YYYY");
console.log(simpleExtractor.extractAndFormatDate("cancela 6 ago 2025")); // "06/08/2025"
console.log(simpleExtractor.extractAndFormatDate("vence 31 diciembre 2024")); // "31/12/2024"

// 3. More specific patterns
console.log('\n=== Specific patterns ===');
const specificExtractor = new DateExtractor();
specificExtractor.setPatternFromSimpleText("hasta DD MONTH YYYY");
console.log(specificExtractor.extractAndFormatDate("Vence hasta 15 diciembre 2024")); // "15/12/2024"

// 4. Different formats
console.log('\n=== Different formats ===');
const deExtractor = new DateExtractor();
deExtractor.setPatternFromSimpleText("DD de MONTH de YYYY");
console.log(deExtractor.extractAndFormatDate("Fecha 25 de marzo de 2024")); // "25/03/2024"

// 5. US date format output
console.log('\n=== US format output ===');
const usExtractor = new DateExtractor({ outputFormat: 'MM/DD/YYYY' });
usExtractor.setPatternFromSimpleText("DD MONTH YYYY");
console.log(usExtractor.extractAndFormatDate("payment 15 julio 2025")); // "07/15/2025"

// 6. Advanced regex (for power users)
console.log('\n=== Advanced regex ===');
const advancedExtractor = new DateExtractor({ debug: true });
advancedExtractor.setPatternFromText('(\\d{1,2})\\s+de\\s+([a-záéíóúñ]+)\\s+de\\s+(\\d{4})');
console.log(advancedExtractor.extractAndFormatDate("Contrato 15 de agosto de 2025")); // "15/08/2025"

*/