import os
import io
import json
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
import asyncpg
from database import get_db
from dependencies import get_admin_user
from langchain_voyageai import VoyageAIEmbeddings
from pypdf import PdfReader

router = APIRouter()

embeddings = VoyageAIEmbeddings(
    voyage_api_key=os.getenv("VOYAGE_AI_API_KEY"),
    model="voyage-2"
)

def split_text_into_chunks(text: str, chunk_size: int = 1000):
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks

@router.get("/", status_code=status.HTTP_200_OK)
async def get_documents(
    user: dict = Depends(get_admin_user),
    db_conn: asyncpg.Connection = Depends(get_db)
):
    try:
        rows = await db_conn.fetch('SELECT id, filename, file_type FROM documents')
        if not rows:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No documents found")
            
        docs = [dict(row) for row in rows]
        # Convert UUID to string for JSON serialization
        for doc in docs:
            if 'id' in doc:
                doc['id'] = str(doc['id'])
                
        return {
            "message": "Documents retrieved successfully",
            "data": docs
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get documents error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    user: dict = Depends(get_admin_user),
    db_conn: asyncpg.Connection = Depends(get_db)
):
    if not file:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file uploaded")
        
    try:
        content = await file.read()
        raw_text = ""
        
        if file.content_type == "application/pdf":
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    raw_text += text + "\n"
        else:
            raw_text = content.decode("utf-8")
            
        if not raw_text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not extract text from file")
            
        chunks = split_text_into_chunks(raw_text, 1000)
        
        # Batch embed the chunks using VoyageAI
        vectors = await embeddings.aembed_documents(chunks)
        
        async with db_conn.transaction():
            doc_id = await db_conn.fetchval(
                """INSERT INTO documents (user_id, filename, file_type, status, file_url) 
                   VALUES (CAST($1 AS UUID), $2, $3, 'INDEXED', $4) RETURNING id""",
                user['id'], file.filename, file.content_type, "uploaded_via_api"
            )
            
            # Insert chunks and vectors
            for i in range(len(chunks)):
                vector_string = f"[{','.join(map(str, vectors[i]))}]"
                await db_conn.execute(
                    'INSERT INTO document_chunks (document_id, content, embedding) VALUES ($1, $2, CAST($3 AS vector))',
                    doc_id, chunks[i], vector_string
                )
                
        return {"message": "Document processed and indexed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
async def delete_document(
    document_id: str,
    user: dict = Depends(get_admin_user),
    db_conn: asyncpg.Connection = Depends(get_db)
):
    try:
        async with db_conn.transaction():
            await db_conn.execute('DELETE FROM document_chunks WHERE document_id = CAST($1 AS UUID)', document_id)
            await db_conn.execute('DELETE FROM documents WHERE id = CAST($1 AS UUID)', document_id)
            
        return {"message": "Document deleted successfully"}
    except Exception as e:
        print(f"Delete document error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
