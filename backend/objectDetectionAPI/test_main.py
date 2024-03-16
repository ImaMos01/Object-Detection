from fastapi.testclient import TestClient
from io import BytesIO
from PIL import Image
from main import app

IMAGE_URL = "../../images/mainPage.png"

#Unit testing
client = TestClient(app)

def test_post():
  response = client.post("/predict/", files={"file":("filename",open(IMAGE_URL,"rb"),"image/jpeg")})
  #check the response
  assert response.status_code == 200

  #check if the response is a valid image
  image = Image.open(BytesIO(response.content))
  assert isinstance(image, Image.Image)

  print("Image processed successfully!")
