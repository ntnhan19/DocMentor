from openai import AsyncOpenAI
from app.config import settings
import asyncio

async def test_openai():
    try:
        print("Testing OpenAI API...")
        print(f"API Key: {settings.OPENAI_API_KEY[:10]}...")
        
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        response = await client.embeddings.create(
            model="text-embedding-ada-002",
            input="This is a test"
        )
        
        print(f"✅ OpenAI API working! Embedding dimensions: {len(response.data[0].embedding)}")
        return True
    except Exception as e:
        print(f"❌ OpenAI API Error: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_openai())