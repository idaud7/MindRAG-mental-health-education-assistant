"""Clean and merge PDF documents before ingestion."""

import argparse
import os
import re

import fitz
from fpdf import FPDF
from pypdf import PdfReader, PdfWriter


def merge_pdfs(pdf_list: list[str], output_path: str) -> None:
    writer = PdfWriter()
    for pdf_file in pdf_list:
        reader = PdfReader(pdf_file)
        for page in reader.pages:
            writer.add_page(page)

    with open(output_path, "wb") as output_file:
        writer.write(output_file)


def clean_text(text: str) -> str:
    text = re.sub(r"[^\x00-\x7F]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


class CleanPDF(FPDF):
    def chapter_body(self, text: str) -> None:
        self.set_font("Arial", "", 11)
        self.multi_cell(0, 10, text)


def create_cleaned_pdf(input_pdf_path: str, output_pdf_path: str) -> None:
    doc = fitz.open(input_pdf_path)
    cleaned_text = ""
    for page in doc:
        cleaned_text += clean_text(page.get_text()) + "\n\n"

    pdf = CleanPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.chapter_body(cleaned_text)
    pdf.output(output_pdf_path)
    print(f"Saved cleaned PDF: {output_pdf_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Merge and clean PDF files")
    parser.add_argument("--inputs", nargs="+", required=True, help="Input PDF paths")
    parser.add_argument("--output_dir", type=str, required=True, help="Output directory")
    parser.add_argument("--name", type=str, default="cleaned_document")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    merged_path = os.path.join(args.output_dir, f"{args.name}_merged.pdf")
    cleaned_path = os.path.join(args.output_dir, f"{args.name}_cleaned.pdf")

    merge_pdfs(args.inputs, merged_path)
    create_cleaned_pdf(merged_path, cleaned_path)


if __name__ == "__main__":
    main()
