export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
}

export async function buildBookmarkPayload(data) {
  // Construir location
  const location = (data.latitude && data.longitude)
    ? { latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) }
    : undefined;

  // Tomar todas las imágenes y convertirlas a base64
  let images = [];
  if (data.images && data.images.length > 0) {
    for (let file of data.images) {
      const base64 = await fileToBase64(file);
      images.push({ base64, name: file.name, type: file.type, size: file.size });
  }
  }

  // Construir el payload según el DTO del backend
  return {
    title: data.title,
    description: data.description,
    tagId: Number(data.tagId),
    categoryId: Number(data.categoryId),
    images,
    video: data.video || "",
    url: data.url || "",
    location,
    publicationDate: new Date().toISOString(),
  };
}
