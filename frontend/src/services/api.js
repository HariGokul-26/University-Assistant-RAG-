import axios from "axios";

// Backend Base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});


// ---------------------------------------------------
// Chat with University Assistant
// ---------------------------------------------------
export const askQuestion = async (query) => {
  const response = await API.post("/chat", {
    query,
  });

  return response.data;
};


// ---------------------------------------------------
// Upload PDF(s)
// ---------------------------------------------------
export const uploadDocuments = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


// ---------------------------------------------------
// List Documents
// ---------------------------------------------------
export const getDocuments = async () => {
  const response = await API.get("/documents");

  return response.data;
};


// ---------------------------------------------------
// Delete Document
// ---------------------------------------------------
export const deleteDocument = async (documentName) => {
  const response = await API.delete(
    `/documents/${encodeURIComponent(documentName)}`
  );

  return response.data;
};

export default API;
