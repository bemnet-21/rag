# Project Summary: RAG Landing Page

## Project Overview
The "RAG Landing Page" is a full-stack web application designed to provide a modern coworking experience enhanced by an AI-powered assistant. The core purpose is to allow users (and admins) to interact with an intelligent chatbot, upload and index documents for retrieval-augmented generation (RAG), and manage knowledge resources. The platform supports authentication, role-based access, and a seamless, modern UI for both general users and administrators.

## Technical Stack

### Frontend (client)
- **Framework:** Next.js 16 (React 19)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **UI Libraries:**
  - Tailwind CSS (with custom themes)
  - Lucide React, React Icons
  - React Markdown (for chat rendering)
- **Auth & API:**
  - JWT-based authentication (token stored in localStorage)
  - Google OAuth (via `@react-oauth/google`)
  - Axios for API requests (with interceptor for auth token)
- **Other:**
  - TypeScript for type safety
  - ESLint for code quality

### Backend (server)
- **Runtime:** Node.js (ESM modules)
- **Framework:** Express.js
- **Libraries:**
  - `@google/generative-ai`, `@langchain/*`, `openai` (for AI and embeddings)
  - `pg` (PostgreSQL client)
  - `bcrypt` (password hashing)
  - `jsonwebtoken` (JWT auth)
  - `multer` (file uploads)
  - `pdf-parse` (PDF text extraction)
  - `dotenv`, `cors`

## Database & Authentication
- **Database:** PostgreSQL (cloud-hosted, SSL enabled)
  - **Key Tables:**
    - `users` (id, full_name, email, password, role)
    - `documents` (id, user_id, filename, file_type, status, file_url)
    - `document_chunks` (id, document_id, content, embedding)
- **Authentication:**
  - JWT tokens (signed with secret, includes user id, role, email, name)
  - Passwords hashed with bcrypt
  - Role-based access via middleware (`protect`, `authorizeRoles`)
  - Google OAuth available on frontend (not fully wired in backend)

## Key Features & Logic
1. **AI Chatbot (RAG Engine):**
   - Users interact with a chat widget powered by Google Gemini and LangChain.
   - User messages are embedded, matched against vectorized document chunks in the DB, and used as context for generative AI responses.
   - Data flow: User → `/api/v1/chat/` (POST) → Embedding/Vector Search → Gemini Model → Response → Client.

2. **Document Upload & Indexing:**
   - Admins can upload PDF/TXT/DOC files.
   - Files are parsed, chunked, embedded (Voyage/Gemini), and stored in `document_chunks` with vector embeddings.
   - Data flow: Admin → `/api/v1/document/upload` (POST, multipart) → File parse → Embedding → DB insert.

3. **Authentication & Role Management:**
   - Signup/Login with JWT issuance.
   - Redux state for auth, token stored in localStorage.
   - Middleware on backend for route protection and role checks.

4. **Document Management:**
   - Admins can view and delete indexed documents.
   - Deletion cascades to both `documents` and `document_chunks`.
   - Data flow: Admin → `/api/v1/document/` (GET/DELETE) → DB.

5. **Modern UI/UX:**
   - Responsive, accessible design with Tailwind.
   - Real-time chat, upload progress, and status feedback.
   - Markdown rendering in chat.

## API Architecture
- **RESTful Endpoints:**
  - `/api/v1/auth/signup` (POST): Register user
  - `/api/v1/auth/login` (POST): Login, returns JWT
  - `/api/v1/chat/` (POST): Protected, user chat to AI
  - `/api/v1/document/` (GET): Admin only, list documents
  - `/api/v1/document/upload` (POST): Admin only, upload document
  - `/api/v1/document/:id` (DELETE): Admin only, delete document
- **Controllers:**
  - `authController.js`: Handles signup/login, password hashing, JWT issuance
  - `chatController.js`: Handles embedding, vector search, Gemini prompt, response
  - `documentController.js`: Handles file upload, parsing, chunking, embedding, DB insert/delete
- **Middleware:**
  - `authMiddleware.js`: JWT verification, attaches user to request
  - `roleMiddleware.js`: Role-based access control

## Technical Challenges Solved
- **Vector Search in SQL:** Uses Postgres with vector embeddings for semantic search (`ORDER BY embedding <-> $1 LIMIT 3`).
- **File Upload & Parsing:** Handles PDF and text parsing, chunking, and embedding in a scalable way.
- **RAG Pipeline:** Integrates LangChain, Gemini, and custom vector DB for context-aware chat.
- **Role-based Security:** Middleware ensures only admins can manage documents.
- **Robust Error Handling:** Transactional DB operations with rollback on failure.

## Performance & Optimization
- **Vector Indexing:** Embeddings are precomputed and stored for fast retrieval.
- **Chunked Processing:** Large documents are split into manageable chunks for efficient search and embedding.
- **API Interceptors:** Axios interceptors for seamless auth token management.
- **UI Feedback:** Loading states, optimistic updates, and error messages for better UX.

---
This documentation provides a comprehensive technical overview of the RAG Landing Page project, covering architecture, features, and implementation details for both frontend and backend. For further details, review the codebase or reach out to the project maintainers.
