# 🎓 University Assistant

An AI-powered University Assistant built using **FastAPI**, **React**, **ChromaDB**, and **Groq LLM**. The application allows users to upload university documents (PDFs) and ask natural language questions to receive accurate, context-aware answers using Retrieval-Augmented Generation (RAG).

---

## 🚀 Features

- 📄 Upload one or more university PDF documents
- 🧠 Automatic text extraction and intelligent chunking
- 🔍 Semantic search using ChromaDB vector database
- 🤖 AI-powered question answering with Groq LLM
- 📚 Displays source documents with page numbers and similarity scores
- 🗂️ List all uploaded documents
- 🗑️ Delete indexed documents
- 💬 Modern chat-based user interface
- ⚡ FastAPI REST backend with React frontend

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Lucide React

### Backend
- FastAPI
- ChromaDB
- Sentence Transformers
- Groq API
- PyMuPDF
- Python

### AI & RAG
- Retrieval-Augmented Generation (RAG)
- all-MiniLM-L6-v2 Embedding Model
- ChromaDB Vector Store
- Llama 3.3 70B Versatile (Groq)

---

## 📂 Project Structure

```
University-Assistant/
│
├── backend/
│   ├── app.py
│   ├── rag.py
│   ├── pdf_processor.py
│   ├── requirements.txt
│   ├── uploads/
│   └── chroma_db/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/University-Assistant.git

cd University-Assistant
```

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
```

Run the backend:

```bash
uvicorn app:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

## Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Health check |
| POST | `/upload` | Upload PDF documents |
| POST | `/chat` | Ask questions |
| GET | `/documents` | List indexed documents |
| DELETE | `/documents/{document_name}` | Delete a document |

---

## Example Chat Response

```json
{
  "question": "What is the attendance requirement?",
  "answer": "Students must maintain at least 75% attendance...",
  "sources": [
    {
      "document": "UG-Arts-Regulations-2025.pdf",
      "page": 13,
      "similarity_score": 0.82,
      "context": "Students must maintain at least 75% attendance..."
    }
  ]
}
```

---

## Future Enhancements

- Conversation memory
- Chat history
- Authentication
- Query rewriting
- Hybrid Search (BM25 + Vector Search)
- Cloud storage (AWS S3)
- Production vector database
- Admin dashboard

---

## Author

Developed by **Hari Gokul**

```

---

### 💡 One suggestion

Since this is a **portfolio-quality GenAI project**, I also recommend adding:

- 📸 **Screenshots** of the UI
- 🎥 **Demo GIF or video**
- 🌐 **Live demo link** (after deployment)
- 🔗 **LinkedIn** and **Portfolio** links

These additions make the repository more engaging and give recruiters a quick way to see the application in action.
