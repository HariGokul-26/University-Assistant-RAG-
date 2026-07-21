from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from pdf_processor import extract_text_from_pdf, create_chunks
from rag import (
    store_chunks,
    ask_question,
    list_documents,
    delete_document
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder to save uploaded PDFs
UPLOAD_FOLDER = "uploads"

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ------------------------------------------------------------------
# Request Model
# ------------------------------------------------------------------
class SearchRequest(BaseModel):
    query: str


# ------------------------------------------------------------------
# Home
# ------------------------------------------------------------------
@app.get("/")
def home():
    return {
        "message": "University RAG Chatbot Backend is Running 🚀"
    }


# ------------------------------------------------------------------
# Upload PDFs
# ------------------------------------------------------------------
@app.post("/upload")
async def upload_pdfs(files: list[UploadFile] = File(...)):

    try:

        uploaded_files = []

        for file in files:

            # Save uploaded PDF
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)

            with open(file_path, "wb") as pdf:
                pdf.write(await file.read())

            uploaded_files.append(file.filename)

            # Extract text page by page
            pages = extract_text_from_pdf(file_path)

            # Create overlapping chunks
            chunks = create_chunks(
                pages,
                file.filename
            )

            # Display chunk information
            print("\n" + "=" * 80)
            print(f"Document    : {file.filename}")
            print(f"Total Pages : {len(pages)}")
            print(f"Total Chunks: {len(chunks)}")
            print("=" * 80)

            # Print only first 3 chunks
            for chunk in chunks[:3]:

                print("-" * 80)
                print(f"Document : {chunk['document']}")
                print(f"Page     : {chunk['page']}")
                print(f"Chunk ID : {chunk['chunk_id']}")
                print(f"Length   : {len(chunk['text'])} characters")

            if len(chunks) > 3:
                print(f"\n... {len(chunks) - 3} more chunks")

            # Store chunks
            stored = store_chunks(chunks)

            if stored:
                print("✓ Upload completed.\n")
            else:
                print("✓ Upload skipped.\n")

        return {
            "message": "Files uploaded successfully!",
            "files": uploaded_files
        }

    except Exception as e:

        print(f"Upload Error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to upload and process the document."
        )


# ------------------------------------------------------------------
# Chat Endpoint
# ------------------------------------------------------------------
@app.post("/chat")
def chat(request: SearchRequest):

    try:

        return ask_question(request.query)

    except Exception as e:

        print(f"Chat Error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Unable to answer your question at the moment."
        )


# ------------------------------------------------------------------
# List Documents
# ------------------------------------------------------------------
@app.get("/documents")
def documents():

    try:

        docs = list_documents()

        return {
            "total_documents": len(docs),
            "documents": docs
        }

    except Exception as e:

        print(f"Documents Error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve indexed documents."
        )


# ------------------------------------------------------------------
# Delete Document
# ------------------------------------------------------------------
@app.delete("/documents/{document_name}")
def remove_document(document_name: str):

    try:

        return delete_document(document_name)

    except Exception as e:

        print(f"Delete Error: {e}")

        raise HTTPException(
            status_code=500,
            detail="Failed to delete the document."
        )
