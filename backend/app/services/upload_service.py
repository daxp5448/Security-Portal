from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError

from app.core.config import settings


class UploadService:
    @staticmethod
    async def save_incident_image(file: UploadFile, incident_id: int) -> str:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only image uploads are allowed")

        upload_root = Path(settings.UPLOAD_DIR)
        incident_dir = upload_root / "incidents"
        incident_dir.mkdir(parents=True, exist_ok=True)

        destination = incident_dir / f"incident_{incident_id}_{uuid4().hex}.jpg"
        content = await file.read()

        try:
            image = Image.open(BytesIO(content))
            image = image.convert("RGB")
            image.thumbnail((settings.IMAGE_MAX_WIDTH, settings.IMAGE_MAX_HEIGHT))
            image.save(destination, format="JPEG", optimize=True, quality=settings.IMAGE_QUALITY)
        except UnidentifiedImageError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image file") from exc

        return destination.relative_to(upload_root).as_posix()
