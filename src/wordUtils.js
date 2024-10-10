import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
} from 'docx';
import transliterate from 'translit-rus-eng';
import path from 'path';
import { fileURLToPath } from 'url';

function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function createTableCell(text, width) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, font: 'Times New Roman', size: 22 }),
        ],
      }),
    ],
  });
}

export async function createWordDocument(mergeRequests, authorName) {
  const headerRow = new TableRow({
    children: [
      createTableCell('№', 10),
      createTableCell('Код', 20),
      createTableCell('Краткое описание', 40),
      createTableCell('Решение', 20),
      createTableCell('Период', 10),
    ],
  });

  const dataRows = mergeRequests.map((mr, index) =>
    new TableRow({
      children: [
        createTableCell(String(index + 1), 10),
        createTableCell(mr.source_branch, 20),
        createTableCell(mr.title, 40),
        createTableCell(mr.web_url, 20),
        createTableCell(mr.updated_at.substring(0, 10), 10),
      ],
    })
  );

  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  const doc = new Document({
    sections: [{ children: [table] }],
  });

  const buffer = await Packer.toBuffer(doc);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const folderPath = path.join(__dirname, '..' ,'documents');
  ensureFolderExists(folderPath);

  const currentDate = new Date().toISOString().slice(0, 10);
  const safeAuthorName = transliterate(authorName, { engToRus: true });
  const fileName = `Документ для задач ${safeAuthorName} ${currentDate}.docx`;
  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, buffer);

  console.log(`Документ успешно создан: ${filePath}`);
}