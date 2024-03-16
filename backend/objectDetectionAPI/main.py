from fastapi import FastAPI
from fastapi import File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse,StreamingResponse

from app import get_image_from_bytes
from app import detect_sample_model
from app import add_bboxs_on_img
from app import get_bytes_from_image

#initialize the FastAPI app
app = FastAPI()

# allow client requests 
# from specific domains (specified in the origins argument) 
origins = [
    "http://localhost",
    "http://localhost:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
  return {"message":"Hello, world"}

#predict images 
@app.post("/predict/")
async def detect_objects(file: bytes = File(...)):
  """
    Object detection and return the image with boxes.
    
    Args:
      file (bytes): The image file in bytes format.
    Returns:
      Image: Image in bytes with bbox annotations.
  """
  try:
    #get image from bytes
    image = get_image_from_bytes(file)
    
    #model predict
    detections = detect_sample_model(image)
    
    #Add box image
    outputImage = add_bboxs_on_img(image,detections) 

    return StreamingResponse(content=get_bytes_from_image(outputImage), status_code=200, media_type="image/jpeg")
    
  except Exception as e:
    return JSONResponse(content={"error": str(e)}, status_code=500)