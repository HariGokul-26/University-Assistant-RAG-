import os

import chromadb
from dotenv import load_dotenv
from groq import Groq
from sentence_transformers import SentenceTransformer

# Load environment variables
load_dotenv()

# Initialize Groq client
groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Load embedding model
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("Embedding model loaded successfully!")

# Initialize ChromaDB
print("Initializing ChromaDB...")

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="university_documents"
)

print("ChromaDB initialized successfully!")


# ------------------------------------------------------------------
# Generate embeddings
# ------------------------------------------------------------------
def generate_embeddings(chunks):

    embeddings = model.encode(
        [chunk["text"] for chunk in chunks],
        show_progress_bar=True
    )

    return embeddings


# ------------------------------------------------------------------
# Store chunks and embeddings in ChromaDB
# ------------------------------------------------------------------
def store_chunks(chunks):

    document_name = chunks[0]["document"]

    print("\nChecking existing documents...")

    if document_exists(document_name):

        print(f"✓ '{document_name}' is already indexed.")
        print("Skipping embedding generation.")
        print("Skipping ChromaDB storage.")

        return False

    print("\nGenerating embeddings...")

    embeddings = generate_embeddings(chunks)

    print(f"✓ Embeddings Generated : {len(embeddings)}")

    print("\nStoring in ChromaDB...")

    print("\nStoring in ChromaDB...")

    try:

            collection.add(
                ids=[chunk["id"] for chunk in chunks],
                documents=[chunk["text"] for chunk in chunks],
                embeddings=embeddings.tolist(),
                metadatas=[
                    {
                        "document": chunk["document"],
                        "page": chunk["page"],
                        "chunk_id": chunk["chunk_id"]
                    }
                    for chunk in chunks
                ]
            )

            print(f"✓ Vector Records Stored : {len(chunks)}")

            return True

    except Exception as e:

            print(f"ChromaDB Store Error: {e}")

            raise Exception("Unable to store document vectors.")

# ------------------------------------------------------------------
# Search ChromaDB
# ------------------------------------------------------------------
def search_chunks(query, top_k=10):

    print("\nSearching ChromaDB...")

    # Generate embedding for the query
    query_embedding = model.encode(query)

    # Search vector database
    try:

        results = collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_k,
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

    except Exception as e:

        print(f"Search Error: {e}")

        raise Exception("Unable to search the vector database.")

    formatted_results = []

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    for index, (document, metadata, distance) in enumerate(
        zip(documents, metadatas, distances),
        start=1
    ):

        # Convert distance to similarity score
        similarity_score = round(1 - distance, 4)

        formatted_results.append({
            "rank": index,
            "similarity_score": similarity_score,
            "document": metadata["document"],
            "page": metadata["page"],
            "chunk_id": metadata["chunk_id"],
            "text": document
        })

    print(f"✓ Retrieved {len(formatted_results)} matching chunks.")

    return formatted_results


# ------------------------------------------------------------------
# Build Prompt
# ------------------------------------------------------------------
def build_prompt(question, chunks):

    context = ""

    for chunk in chunks:

        context += (
            f"Document : {chunk['document']}\n"
            f"Page     : {chunk['page']}\n\n"
            f"{chunk['text']}\n\n"
        )

    prompt = f"""
You are a helpful University Assistant.

Use ONLY the provided context to answer.

The answer may require combining information from multiple retrieved chunks.

If multiple chunks contain related information, combine them into one complete answer.

Do not invent information.

If the answer is not reasonably supported by the provided context, reply exactly:

"I couldn't find the answer in the uploaded documents."

Context
-------

{context}

-------

Question:
{question}

Answer:
"""

    return prompt


# ------------------------------------------------------------------
# Call Groq
# ------------------------------------------------------------------
def call_groq(prompt):

    try:

        response = groq_client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful University Assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2
        )

        return response.choices[0].message.content

    except Exception as e:

        print(f"Groq Error: {e}")

        raise Exception("Unable to generate an answer using Groq.")

# ------------------------------------------------------------------
# Return Unique Sources
# ------------------------------------------------------------------
def get_unique_sources(chunks):

    unique_sources = []
    seen = set()

    for chunk in chunks:

        source = (
            chunk["document"],
            chunk["page"]
        )

        if source not in seen:

            seen.add(source)

            unique_sources.append({

                "document": chunk["document"],
                "page": chunk["page"],
                "similarity_score": chunk["similarity_score"],
                "context": chunk["text"]

            })

    return unique_sources

# ------------------------------------------------------------------
# Check whether a document is already indexed
# ------------------------------------------------------------------
def document_exists(document_name):

    results = collection.get(
        where={"document": document_name},
        limit=1
    )

    return len(results["ids"]) > 0   

# ------------------------------------------------------------------
# List indexed documents
# ------------------------------------------------------------------
def list_documents():

    try:

        results = collection.get(
            include=["metadatas"]
        )

        documents = {
            metadata["document"]
            for metadata in results["metadatas"]
        }

        return sorted(documents)

    except Exception as e:

        print(f"List Documents Error: {e}")

        raise Exception("Unable to retrieve indexed documents.")

# ------------------------------------------------------------------
# Delete document from ChromaDB and uploads folder
# ------------------------------------------------------------------
def delete_document(document_name):

    print(f"\nDeleting document: {document_name}")

    # Check whether document exists
    if not document_exists(document_name):

        print("Document not found.")

        return {
            "success": False,
            "message": "Document not found."
        }

    # Delete vectors from ChromaDB
    try:

        collection.delete(
            where={
                "document": document_name
            }
        )

        print("✓ Deleted vectors from ChromaDB.")

    except Exception as e:

        print(f"ChromaDB Delete Error: {e}")

        raise Exception("Unable to delete document from ChromaDB.")

    # Delete PDF from uploads folder
    try:

        pdf_path = os.path.join("uploads", document_name)

        if os.path.exists(pdf_path):

            os.remove(pdf_path)

            print("✓ Deleted PDF from uploads folder.")

        else:

            print("PDF file not found in uploads folder.")

    except Exception as e:

        print(f"File Delete Error: {e}")

        raise Exception("Unable to delete PDF from uploads folder.")

    return {
        "success": True,
        "message": "Document deleted successfully.",
        "document": document_name
    }
    
# ------------------------------------------------------------------
# Complete RAG Pipeline
# ------------------------------------------------------------------
def ask_question(question):

    print("\nSearching for relevant chunks...")

    chunks = search_chunks(question)

    print("✓ Context Retrieved")

    print("\nBuilding prompt...")

    prompt = build_prompt(question, chunks)

    print("✓ Prompt Built")

    print("\nGenerating answer using Groq...")

    answer = call_groq(prompt)

    print("✓ Answer Generated")

    return {
        "question": question,
        "answer": answer,
        "sources": get_unique_sources(chunks)
    }
    
    
 