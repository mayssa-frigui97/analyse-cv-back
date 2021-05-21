// const pdfjsLib = require("pdfjs-dist");

// async function GetTextFromPDF(path) {
    // let doc = await pdfjsLib.getDocument(path).promise;
    // let page1 = await doc.getPage(1);
    // let content = await page1.getTextContent();
    // let strings = content.items.map(function(item) {
    //     return item.str;
    // });
    // return strings;
// }

// module.exports = { GetTextFromPDF }

import * as pdfjslib from 'pdfjs-dist/es5/build/pdf.js';

export default class Pdf {
  public static async getPageText(pdf: any, pageNo: number) {
    const page = await pdf.getPage(pageNo);
    const tokenizedText = await page.getTextContent();
    const pageText = tokenizedText.items.map((token: any) => token.str).join('');
    return pageText;
  }

  public static async getPDFText(source: any): Promise<string> {
    console.log("doc: ",source);
    const pdf = await pdfjslib.getDocument(source).promise;
    const maxPages = pdf.numPages;
    const pageTextPromises = [];
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      pageTextPromises.push(Pdf.getPageText(pdf, pageNo));
    }
    const pageTexts = await Promise.all(pageTextPromises);
    return pageTexts.join(' ');
  }
}