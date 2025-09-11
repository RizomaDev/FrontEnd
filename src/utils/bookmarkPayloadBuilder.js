
function buildBasePayload(data) {
  const location = (data.latitude && data.longitude)
    ? { latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude) }
    : undefined;

  return {
    title: data.title,
    description: data.description,
    tagId: Number(data.tagId),
    categoryId: Number(data.categoryId),
    video: data.video || "",
    url: data.url || "",
    location,
    publicationDate: new Date().toISOString(),
  };
}

function processCloudinaryImages(imageUrls) {
  return imageUrls;
}

export function buildBookmarkPayloadSimple(data) {
  const basePayload = buildBasePayload(data);
  
  const imageUrls = data.imageUrls && data.imageUrls.length > 0 
    ? processCloudinaryImages(data.imageUrls)
    : [];

  return {
    ...basePayload,
    imageUrls
  };
}

