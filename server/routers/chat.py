import os
import json
from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg
from database import get_db
from dependencies import get_current_user
from schemas import ChatMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_voyageai import VoyageAIEmbeddings

router = APIRouter()

# Initialize embeddings and model lazily or globally
embeddings = VoyageAIEmbeddings(
    voyage_api_key=os.getenv("VOYAGE_AI_API_KEY"),
    model="voyage-2"
)

chat_model = ChatGoogleGenerativeAI(
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    model="gemini-2.5-flash",
    temperature=0.3
)

@router.post("/", status_code=status.HTTP_200_OK)
async def chat(
    payload: ChatMessage,
    user: dict = Depends(get_current_user),
    db_conn: asyncpg.Connection = Depends(get_db)
):
    message = payload.message
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    try:
        # Generate embedding for the question
        question_embedding = await embeddings.aembed_query(message)
        vector_string = f"[{','.join(map(str, question_embedding))}]"
        
        # Query pgvector for most similar chunks
        query = "SELECT content FROM document_chunks ORDER BY embedding <-> CAST($1 AS vector) LIMIT 3"
        rows = await db_conn.fetch(query, vector_string)
        
        if not rows:
            return {"answer": "No relevant documents found"}
            
        context = "\n".join([row['content'] for row in rows])
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant. use the provided context to answer the user's question accurately. If the context does not contain the answer, say \"I'm sorry, I don't have that information.\"\nContext: {context}"),
            ("human", "{message}")
        ])
        
        chain = prompt | chat_model | StrOutputParser()
        
        response = await chain.ainvoke({
            "context": context,
            "message": message
        })
        
        return {"answer": response}

    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
