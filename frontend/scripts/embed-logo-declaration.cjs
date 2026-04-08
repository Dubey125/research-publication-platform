// embed-logo-declaration.cjs
// Loads the existing declaration PDF, adds the journal logo to each page header, and overwrites the file.
// Run with: node scripts/embed-logo-declaration.cjs

const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const INPUT_PDF = path.join(PUBLIC_DIR, 'IJTSE-Declaration-Form.pdf');
const LOGO_IMG = path.join(PUBLIC_DIR, 'logo.png');

(async () => {
  if (!fs.existsSync(INPUT_PDF)) {
    console.error('Declaration PDF not found:', INPUT_PDF);
    process.exit(1);
  }
  if (!fs.existsSync(LOGO_IMG)) {
    console.error('Logo image not found:', LOGO_IMG);
    process.exit(1);
  }

  const pdfBytes = fs.readFileSync(INPUT_PDF);
  const logoBytes = fs.readFileSync(LOGO_IMG);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.1); // scale logo to 10% of original size (reduced)

  const pages = pdfDoc.getPages();
  pages.forEach((page, idx) => {
    const { width, height } = page.getSize();
    // Place logo at top‑right corner with some margin
    const x = width - logoDims.width - 30; // 30pt margin from right
    const y = height - logoDims.height - 30; // 30pt margin from top
    page.drawImage(logoImage, {
      x,
      y,
      width: logoDims.width,
      height: logoDims.height,
    });
  });

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(INPUT_PDF, modifiedPdfBytes);
  console.log('✅ Logo embedded into', INPUT_PDF);
})();
