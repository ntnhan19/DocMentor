import sys, os
sys.path.append(os.path.dirname(__file__))  # thêm backend vào PYTHONPATH

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)