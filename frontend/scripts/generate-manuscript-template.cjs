/**
 * Generates the IJTSE Manuscript Template PDF — exactly 4 pages.
 * Uses lineBreak:false to prevent pdfkit auto-pagination.
 */
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', 'public', 'IJTSE-Manuscript-Template.pdf');

const C = { navy:'#1B3A5C', gold:'#D4A843', wh:'#FFF', bk:'#000', dk:'#333', md:'#555', lt:'#999', alt:'#F2F6FA', brd:'#CCC', lnk:'#1155CC' };
const L = 50, R = 50, T = 55, B = 50;
const PW = 595.28, PH = 841.89, CW = PW - L - R;

const doc = new PDFDocument({ size:'A4', autoFirstPage:false, bufferPages:false, margins:{top:T,bottom:B,left:L,right:R} });
const ws = fs.createWriteStream(out);
doc.pipe(ws);

function hdr(d){
  d.save().rect(L,T,CW,22).fill(C.navy);
  d.font('Helvetica-Bold').fontSize(7).fillColor(C.wh).text('International Journal of Transdisciplinary Science and Engineering',L+5,T+3,{lineBreak:false});
  d.font('Helvetica').fontSize(5.5).text('ISSN: XXXX-XXXX | Volume XX, Issue XX, Month YYYY',L+5,T+13,{lineBreak:false});
  d.rect(L,T+22,CW,3).fill(C.gold);
  try {
    const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
    d.image(logoPath, PW-R-55, T-10, { width: 40 });
  } catch (e) {
    d.font('Helvetica-Bold').fontSize(13).fillColor(C.navy).text('IJTSE',PW-R-48,T+4,{lineBreak:false});
  }
  d.restore();
}

function ftr(d,n){
  const y=PH-B+6;
  d.save().moveTo(L,y).lineTo(PW-R,y).strokeColor(C.brd).lineWidth(0.3).stroke();
  d.font('Helvetica').fontSize(6).fillColor(C.lt);
  d.text('© IJTSE',L,y+3,{lineBreak:false});
  d.text('Page '+n,(PW-30)/2,y+3,{lineBreak:false});
  d.text('Manuscript Template',PW-R-75,y+3,{lineBreak:false});
  d.restore();
}

function t(d,s,x,y,o){
  o=o||{};
  d.save();
  d.font(o.f||'Helvetica').fontSize(o.s||8).fillColor(o.c||C.md);
  if(o.w){d.text(s,x,y,{width:o.w,align:o.a||'left',lineBreak:false});}
  else{d.text(s,x,y,{lineBreak:false});}
  d.restore();
}

function tw(d,s,x,y,w,o){
  // text wrapped — manually wrap, NO auto-pagination
  o=o||{};
  const sz=o.s||8, fnt=o.f||'Helvetica', clr=o.c||C.md, lg=o.lg||1.5;
  d.save().font(fnt).fontSize(sz).fillColor(clr);
  // use width but lineBreak false — we calculate height ourselves
  d.text(s,x,y,{width:w,align:o.a||'justify',lineGap:lg,lineBreak:true});
  d.restore();
  // calc height
  d.save().font(fnt).fontSize(sz);
  const h = d.heightOfString(s,{width:w,lineGap:lg});
  d.restore();
  return y+h+(o.g||3);
}

function tblRow(d,cells,x,y,ws2,rh,bg){
  let cx=x;
  cells.forEach((c,i)=>{
    d.save();
    d.rect(cx,y,ws2[i],rh).fill(bg||C.wh);
    d.rect(cx,y,ws2[i],rh).strokeColor(C.brd).lineWidth(0.2).stroke();
    const txt=typeof c==='object'?c.t:c;
    const bold=typeof c==='object'&&c.b;
    d.font(bold?'Helvetica-Bold':'Helvetica').fontSize(7).fillColor(C.dk);
    d.text(txt,cx+3,y+3,{width:ws2[i]-6,lineBreak:false});
    d.restore();
    cx+=ws2[i];
  });
}

function tblHdr(d,cells,x,y,ws2,rh){
  let cx=x;
  cells.forEach((h,i)=>{
    d.save().rect(cx,y,ws2[i],rh).fill(C.navy);
    d.font('Helvetica-Bold').fontSize(7).fillColor(C.wh);
    d.text(h,cx+3,y+3,{width:ws2[i]-6,lineBreak:false,align:'center'});
    d.restore();
    cx+=ws2[i];
  });
}

function tbl(d,heads,rows,x,y,ws2){
  const rh=15;
  tblHdr(d,heads,x,y,ws2,rh);
  y+=rh;
  rows.forEach((r,ri)=>{
    tblRow(d,r,x,y,ws2,rh,ri%2===0?C.wh:C.alt);
    y+=rh;
  });
  return y;
}

function sec(d,s,x,y){
  d.save().font('Helvetica-Bold').fontSize(10).fillColor(C.navy).text(s,x,y,{lineBreak:false});
  d.moveTo(x,y+13).lineTo(x+CW*0.45,y+13).strokeColor(C.gold).lineWidth(0.7).stroke();
  d.restore();
}

function sub(d,s,x,y){
  d.save().font('Helvetica-Bold').fontSize(9).fillColor(C.dk).text(s,x,y,{lineBreak:false}).restore();
}

let y;

/* ═══════════════════ PAGE 1 ═══════════════════ */
doc.addPage({size:'A4',margins:{top:T,bottom:B,left:L,right:R}});
hdr(doc);
y=T+36;

t(doc,'International Journal of',L,y,{f:'Helvetica',s:9,c:C.navy});
y+=12;
t(doc,'Transdisciplinary Science',L,y,{f:'Helvetica-Bold',s:13,c:C.navy});
y+=15;
t(doc,'and Engineering',L,y,{f:'Helvetica-Bold',s:13,c:C.navy});
y+=16;
t(doc,'ISSN: XXXX-XXXX | ijtsejournal@gmail.com',L,y,{s:6.5,c:C.lt});
t(doc,'IJTSE',PW-R-85,T+52,{f:'Helvetica-Bold',s:20,c:C.navy});
t(doc,'Open Access Journal',PW-R-85,T+73,{s:6.5,c:C.lt});

y+=14;
doc.save().moveTo(L,y).lineTo(PW-R,y).strokeColor(C.brd).lineWidth(0.3).stroke().restore();
y+=16;

t(doc,'PAPER TITLE IN CAPITAL LETTERS',L,y,{f:'Helvetica-Bold',s:16,c:C.bk,w:CW,a:'center'});
y+=18;
t(doc,'(24pt, Times New Roman, Centered)',L,y,{f:'Helvetica-Bold',s:16,c:C.bk,w:CW,a:'center'});
y+=24;
t(doc,'Subtitle if needed (14pt, Italic, Centered)',L,y,{f:'Helvetica-Oblique',s:10,c:C.md,w:CW,a:'center'});
y+=16;
t(doc,'\u00B9First Author, \u00B2Second Author, \u00B3Third Author',L,y,{f:'Helvetica-Bold',s:9,c:C.bk,w:CW,a:'center'});
y+=13;
t(doc,'\u00B9Designation, Department, Institution Name, City, Country',L,y,{f:'Helvetica-Oblique',s:7,c:C.md,w:CW,a:'center'});
y+=9;
t(doc,'\u00B2Designation, Department, Institution Name, City, Country',L,y,{f:'Helvetica-Oblique',s:7,c:C.md,w:CW,a:'center'});
y+=9;
t(doc,'\u00B3Designation, Department, Institution Name, City, Country',L,y,{f:'Helvetica-Oblique',s:7,c:C.md,w:CW,a:'center'});
y+=12;
t(doc,'Corresponding Author: corresponding.author@email.com | Orchid ID:',L,y,{f:'Helvetica-Bold',s:7.5,c:C.bk,w:CW,a:'center'});
y+=16;

// Abstract box
doc.save().roundedRect(L+12,y,CW-24,58,2).strokeColor(C.navy).lineWidth(0.3).stroke().restore();
y=tw(doc,'Abstract \u2014 Write your abstract here (150\u2013250 words). The abstract should briefly state the purpose of the research or investigation, the principal results and major conclusions. References should therefore be avoided in the abstract. Non-standard or uncommon abbreviations should be avoided, but if essential they must be defined at their first mention in the abstract itself.',L+18,y+5,CW-36,{s:7.5,a:'justify'});
y+=4;
t(doc,'Keywords \u2014 keyword1; keyword2; keyword3; keyword4; keyword5 (4\u20136 keywords, separated by semicolons)',L+18,y,{f:'Helvetica-BoldOblique',s:7,c:C.navy});
y+=18;

sec(doc,'I. INTRODUCTION',L,y); y+=18;
y=tw(doc,'This document provides the formatting guidelines for the International Journal of Transdisciplinary Science and Engineering (IJTSE). Authors must follow these specifications carefully to ensure consistency across all published papers. The formatting style is adapted from Elsevier journal standards. Please use this template as your starting point and do not modify the header and footer sections.',L,y,CW,{s:8});
y=tw(doc,'The introduction should provide sufficient background information to allow the reader to understand and evaluate the results of the present study without referring to previous publications. It should explain why the study was done and what was found. Briefly state the objectives of the work.',L,y,CW,{s:8});

y+=4;
sec(doc,'II. PAPER STRUCTURE AND FORMATTING GUIDELINES',L,y); y+=18;
sub(doc,'2.1 Page Setup',L,y); y+=13;

y=tbl(doc,['Formatting Parameter','Specification'],[
  [{t:'Paper Size',b:1},'A4 (210 mm × 297 mm)'],
  [{t:'Left Margin',b:1},'0.51 inches (13 mm)'],
  [{t:'Right Margin',b:1},'0.51 inches (13 mm)'],
  [{t:'Top Margin',b:1},'0.75 inches (19 mm)'],
  [{t:'Bottom Margin',b:1},'0.75 inches (19 mm)'],
  [{t:'Header Distance',b:1},'0.3 inches'],
  [{t:'Footer Distance',b:1},'0.0 inches'],
],L,y,[CW*0.48,CW*0.52]);
ftr(doc,1);

/* ═══════════════════ PAGE 2 ═══════════════════ */
doc.addPage({size:'A4',margins:{top:T,bottom:B,left:L,right:R}});
hdr(doc);
y=T+35;

y=tbl(doc,['Formatting Parameter','Specification'],[
  [{t:'Column Layout',b:1},'Single column, Justified'],
  [{t:'Font (All Text)',b:1},'Times New Roman only'],
  [{t:'Body Font Size',b:1},'10pt'],
  [{t:'Line Spacing',b:1},'Single'],
  [{t:'Paragraph Spacing',b:1},'0pt / 0pt'],
  [{t:'Paragraph Indentation',b:1},'0.2 inches (first line)'],
],L,y,[CW*0.48,CW*0.52]);

y+=8;sub(doc,'2.2 Title and Authorship Formatting',L,y);y+=13;

y=tbl(doc,['Element','Size','Style'],[
  [{t:'Paper Title',b:1},'24pt','Bold, ALL CAPS, Centered'],
  [{t:'Subtitle',b:1},'14pt','Italic, Centered'],
  [{t:'Author Names',b:1},'12pt','Bold, Centered'],
  [{t:'Affiliation',b:1},'10pt','Italic, Centered'],
  [{t:'Email',b:1},'10pt','Italic, Centered'],
  [{t:'Abstract Label',b:1},'10pt','Bold'],
  [{t:'Abstract Body',b:1},'9pt','Regular, Justified'],
  [{t:'Keywords Label',b:1},'10pt','Bold'],
  [{t:'Keywords',b:1},'9pt','Italic'],
],L,y,[CW*0.22,CW*0.12,CW*0.66]);

y+=8;sub(doc,'2.3 Headings Hierarchy',L,y);y+=13;

y=tbl(doc,['Level','Format','Example'],[
  [{t:'Level 1',b:1},'12pt, Bold, ALL CAPS','I. INTRODUCTION'],
  [{t:'Level 2',b:1},'11pt, Bold','1.1 Background'],
  [{t:'Level 3',b:1},'10pt, Bold Italic','1.1.1 Sub-section'],
],L,y,[CW*0.17,CW*0.35,CW*0.48]);

y+=10;sec(doc,'III. FIGURES, TABLES, AND EQUATIONS',L,y);y+=18;
sub(doc,'3.1 Figures',L,y);y+=13;
y=tw(doc,'All figures should be inserted in the text body as close to their first citation as possible. Figures should be placed at the top or bottom of the page, not in the middle of the text. All figures must be of high resolution (minimum 300 DPI for photographs, 600 DPI for line art).',L,y,CW,{s:7.5});
y=tw(doc,'Figure captions should be placed below the figure, centered, in 10pt Times New Roman. Use the format: "Fig. 1. Caption text."',L,y,CW,{s:7.5});

y+=2;
doc.save().roundedRect(L+40,y,CW-80,25,1).strokeColor(C.brd).lineWidth(0.3).stroke();
doc.font('Helvetica-Oblique').fontSize(7).fillColor(C.lt).text('[ Insert Figure Here ]',L+40,y+8,{width:CW-80,align:'center',lineBreak:false});
doc.restore();
y+=30;
t(doc,'Fig. 1. Caption describing the figure (10pt, Centered, below figure)',L,y,{f:'Helvetica-Bold',s:7,c:C.bk,w:CW,a:'center'});
y+=14;

sub(doc,'3.2 Tables',L,y);y+=13;
y=tw(doc,'Table captions are placed above the table, centered, in 10pt Times New Roman. Use the format: "Table 1. Caption text." All tables must have clearly defined column headers.',L,y,CW,{s:7.5});
t(doc,'Table 1. Sample Table Caption (placed above the table)',L,y,{f:'Helvetica-Bold',s:7,c:C.bk,w:CW,a:'center'});
y+=10;
y=tbl(doc,['Column Head 1','Column Head 2','Column Head 3','Column Head 4'],[
  ['Data entry','Data entry','Data entry','Data entry'],
  ['Data entry','Data entry','Data entry','Data entry'],
  ['Data entry','Data entry','Data entry','Data entry'],
],L,y,[CW*0.25,CW*0.25,CW*0.25,CW*0.25]);

ftr(doc,2);

/* ═══════════════════ PAGE 3 ═══════════════════ */
doc.addPage({size:'A4',margins:{top:T,bottom:B,left:L,right:R}});
hdr(doc);
y=T+35;

sub(doc,'3.3 Equations',L,y);y+=13;
y=tw(doc,'Equations must be typeset using an equation editor (e.g., Microsoft Equation Editor or MathType). Number equations consecutively. Equation numbers are placed in parentheses, flush right.',L,y,CW,{s:7.5});

t(doc,'E = mc²',L+16,y,{f:'Helvetica-Oblique',s:10,c:C.bk});
t(doc,'(1)',PW-R-25,y+1,{s:8,c:C.md});
y+=18;
y=tw(doc,'Refer to equations in text as "Eq. (1)" or "Equation (1)" at the start of a sentence.',L,y,CW,{s:7.5});

y+=4;sec(doc,'IV. CITATIONS AND REFERENCES',L,y);y+=18;
sub(doc,'4.1 In-Text Citations',L,y);y+=13;
y=tw(doc,'IJTSE follows the IEEE citation style. In-text citations are numbered sequentially in square brackets, e.g., [1], [2], [3]. Multiple citations in one location are listed as [1], [3], [5] or as a range [1]–[3].',L,y,CW,{s:7.5});
sub(doc,'4.2 Reference List Format',L,y);y+=13;
y=tw(doc,'References should be listed at the end of the paper in IEEE format. Use 10pt Times New Roman. Examples:',L,y,CW,{s:7.5});
y=tw(doc,'[1] A. Author and B. Author, "Title of article," Journal Name, vol. X, no. X, pp. XX–XX, Month Year.',L+8,y,CW-8,{s:7});
y=tw(doc,'[2] A. Author, Title of Book. City, Country: Publisher, Year, pp. XX–XX.',L+8,y,CW-8,{s:7});
y=tw(doc,'[3] A. Author, "Title of paper," in Proc. Conference Name, City, Country, Year, pp. XX–XX.',L+8,y,CW-8,{s:7});

y+=4;sec(doc,'V. SUBMISSION CHECKLIST',L,y);y+=18;
y=tw(doc,'Before submitting your manuscript to IJTSE, please verify that all of the following conditions are met:',L,y,CW,{s:7.5});
y+=2;
[
  'Paper is in A4 format with the specified margins',
  'Title is in 24pt Times New Roman, ALL CAPS, centered',
  'All body text uses 10pt Times New Roman, single-spaced, justified',
  'Abstract is 150–250 words; 4–6 keywords are provided',
  'All sections use correct heading levels and numbering',
  'Figures are high-resolution (≥300 DPI), captions below figures',
  'Table captions are above tables; tables use specified style',
  'Equations are numbered sequentially and referenced correctly',
  'References are in IEEE format and cited sequentially',
  'Header and footer have NOT been modified',
  'Manuscript is saved as a .docx (Microsoft Word) file',
  'Authors\' contact details, ORCID IDs, affiliations are complete',
].forEach(c=>{
  t(doc,'•  '+c,L+10,y,{s:7,c:C.md});
  y+=11;
});

y+=4;sec(doc,'VI. ETHICAL GUIDELINES AND PLAGIARISM POLICY',L,y);y+=18;
y=tw(doc,'IJTSE is committed to maintaining the highest standards of publication ethics. All submitted manuscripts must be original and must not have been published previously, nor be under consideration for publication elsewhere. Duplicate submission or plagiarism in any form constitutes unethical behavior and is unacceptable.',L,y,CW,{s:7.5});
y=tw(doc,'Authors must ensure that the work described has not been published before (except in the form of an abstract, a published lecture, or academic thesis) and that it is not under consideration for publication elsewhere.',L,y,CW,{s:7.5});
y=tw(doc,'All manuscripts are screened through plagiarism detection software. A similarity index of more than 15% (excluding references and quoted material) may result in rejection.',L,y,CW,{s:7.5});

ftr(doc,3);

/* ═══════════════════ PAGE 4 ═══════════════════ */
doc.addPage({size:'A4',margins:{top:T,bottom:B,left:L,right:R}});
hdr(doc);
y=T+35;

sec(doc,'VII. RECOMMENDED ARTICLE STRUCTURE',L,y);y+=18;
y=tw(doc,'The following structure is recommended for research articles submitted to IJTSE. Review and short communication formats may differ — authors should consult the journal website for specific requirements.',L,y,CW,{s:7.5});
y+=3;

['Title, Authors, Affiliations, Corresponding Author Email',
 'Abstract (150–250 words) and Keywords (4–6 terms)',
 'I. Introduction',
 'II. Literature Review (if applicable)',
 'III. Materials and Methods / Research Methodology',
 'IV. Results and Discussion',
 'V. Conclusion',
 'Acknowledgment (optional)',
 'References (IEEE format)',
 'Appendix (if applicable)',
].forEach((s,i)=>{
  t(doc,(i+1)+'.',L+14,y,{s:8,c:C.dk});
  t(doc,s,L+30,y,{s:8,c:C.dk});
  y+=13;
});

y+=10;sec(doc,'ACKNOWLEDGMENT',L,y);y+=18;
y=tw(doc,'Authors should use this section to acknowledge any funding sources, institutions, or individuals who contributed to the research but do not qualify as co-authors. Sponsorship acknowledgments should be placed here and NOT on the first page or as a footnote.',L,y,CW,{s:7.5});

y+=6;sec(doc,'REFERENCES',L,y);y+=18;
y=tw(doc,'[1] Author A. B., "Paper title," Journal Name, vol. 1, no. 1, pp. 1–10, Jan. 2023.',L,y,CW,{s:7.5});
y=tw(doc,'[2] Author C. D. and Author E. F., Book Title. City: Publisher, 2022.',L,y,CW,{s:7.5});

y+=20;
doc.save().moveTo(L+50,y).lineTo(PW-R-50,y).strokeColor(C.brd).lineWidth(0.3).stroke().restore();
y+=8;
t(doc,'For queries, contact the editorial office at: ijtsejournal@gmail.com',L,y,{s:7.5,c:C.dk,w:CW,a:'center'});
y+=12;
t(doc,'© International Journal of Transdisciplinary Science and Engineering. All rights reserved.',L,y,{f:'Helvetica-Oblique',s:6.5,c:C.lt,w:CW,a:'center'});

ftr(doc,4);

/* ── done ── */
doc.end();
ws.on('finish',()=>{
  const s=fs.statSync(out);
  console.log('✅ PDF: '+out);
  console.log('   Size: '+(s.size/1024).toFixed(1)+' KB');
  
  // Verify page count
  const buf = fs.readFileSync(out, 'utf-8');
  const pageCount = (buf.match(/\/Type\s*\/Page\b/g) || []).length;
  console.log('   Pages: '+pageCount);
});
