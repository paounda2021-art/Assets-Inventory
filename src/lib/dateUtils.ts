const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

/**
 * Format any date string (ISO, typo, or year string) to standard Thai display string
 * Example:
 * - "2023-12-21" -> "21 ธ.ค. 2566"
 * - "10 พ.ศ. 68" -> "10 พ.ค. 2568"
 * - "2564-01-22" -> "22 ม.ค. 2564"
 * - "พ.ศ. 2555"  -> "พ.ศ. 2555"
 */
export function formatThaiDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr.trim() === '' || dateStr.trim() === '-') return '-';

  const cleaned = dateStr.trim();

  // Fix common typo in source data: "10 พ.ศ. 68" or "10 พ.ศ. 2568" -> "10 พ.ค. 2568"
  if (/^\d{1,2}\s+พ\.ศ\.\s+\d{2,4}$/.test(cleaned)) {
    const parts = cleaned.split(/\s+/);
    const day = parts[0];
    let yearNum = parseInt(parts[2], 10);
    if (yearNum < 100) yearNum += 2500;
    return `${day} พ.ค. ${yearNum}`;
  }

  // Format ISO Date YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);

    let yearBE = y;
    if (y < 2400) {
      yearBE = y + 543; // Convert AD to Buddhist Era
    }

    const monthShort = THAI_MONTHS_SHORT[m - 1] || '';
    return `${d} ${monthShort} ${yearBE}`;
  }

  return cleaned;
}

/**
 * Format date for detail modals with full Thai month name
 * Example: "2023-12-21" -> "21 ธันวาคม พ.ศ. 2566"
 */
export function formatThaiDateFull(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr.trim() === '' || dateStr.trim() === '-') return '-';

  const cleaned = dateStr.trim();

  if (/^\d{1,2}\s+พ\.ศ\.\s+\d{2,4}$/.test(cleaned)) {
    const parts = cleaned.split(/\s+/);
    const day = parts[0];
    let yearNum = parseInt(parts[2], 10);
    if (yearNum < 100) yearNum += 2500;
    return `${day} พฤษภาคม พ.ศ. ${yearNum}`;
  }

  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);

    let yearBE = y;
    if (y < 2400) {
      yearBE = y + 543;
    }

    const monthFull = THAI_MONTHS_FULL[m - 1] || '';
    return `${d} ${monthFull} พ.ศ. ${yearBE}`;
  }

  return cleaned;
}
