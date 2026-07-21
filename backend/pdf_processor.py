import fitz

# Chunk Configuration
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


def extract_text_from_pdf(pdf_path):
    pages = []

    document = fitz.open(pdf_path)

    for page_number, page in enumerate(document, start=1):
        pages.append({
            "page": page_number,
            "text": page.get_text()
        })

    document.close()

    return pages


def create_chunks(pages, document_name):
    chunks = []

    chunk_id = 1

    for page in pages:

        text = page["text"]
        page_number = page["page"]

        start = 0

        while start < len(text):

            end = start + CHUNK_SIZE

            chunk_text = text[start:end]

            chunks.append({
                "id": f"{document_name}_page{page_number}_chunk{chunk_id}",
                "document": document_name,
                "page": page_number,
                "chunk_id": chunk_id,
                "text": chunk_text
            })

            chunk_id += 1

            # Move forward while keeping overlap
            start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks