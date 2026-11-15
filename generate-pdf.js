// Minimal pure JS PDF builder
const fs = require('fs');

class SimplePDF {
  constructor() {
    this.pages = [];
  }

  addPage(commands) {
    this.pages.push(commands);
  }

  build() {
    const objects = [];
    const addObject = (content) => {
      objects.push(content);
      return objects.length; // 1-based index
    };

    // Obj 1: Catalog
    const catalogId = addObject('');
    // Obj 2: Pages
    const pagesId = addObject('');
    // Obj 3: Font Helvetica Bold
    const fontBoldId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
    // Obj 4: Font Helvetica
    const fontRegularId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    // Obj 5: Font Helvetica Oblique
    const fontItalicId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>');

    const pageObjIds = [];

    for (const pageCmds of this.pages) {
      const stream = pageCmds.join('\n');
      const contentId = addObject(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
      const pageId = addObject(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595.28 841.89] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontBoldId} 0 R /F2 ${fontRegularId} 0 R /F3 ${fontItalicId} 0 R >> >> >>`
      );
      pageObjIds.push(pageId);
    }

    // Update Catalog and Pages
    objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageObjIds.length} >>`;

    // Construct final PDF binary string
    let out = '%PDF-1.4\n%âãÏÓ\n';
    const xref = [0];

    for (let i = 0; i < objects.length; i++) {
      xref.push(Buffer.byteLength(out, 'latin1'));
      out += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const startXref = Buffer.byteLength(out, 'latin1');
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

    for (let i = 1; i <= objects.length; i++) {
      const offset = String(xref[i]).padStart(10, '0');
      out += `${offset} 00000 n \n`;
    }

    out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
    return Buffer.from(out, 'latin1');
  }
}

module.exports = SimplePDF;
