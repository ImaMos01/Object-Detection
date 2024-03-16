## About

- A simple POST method with FastAPI where the image detection process using Yolov8. It's based of the repository: [Alex-Lekov/yolov8-fastapi](https://github.com/Alex-Lekov/yolov8-fastapi).

## Setup

### version

- `python-3.10.12`
- `pip-22.0.2`

### FastAPI

- `virtualenv myenv`
- `source myenv/bin/activate`
- `python3 -m pip install -r requirements.txt`

#### run

- `cd objectDetectionAPI`
- `uvicorn main:app --reload`
