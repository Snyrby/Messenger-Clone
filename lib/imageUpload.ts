export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`/api/upload`, {
      method: "POST",
      body: JSON.stringify({ path: imagePath }),
    });
    return response.json();
  } catch (error) {
    throw error;
  }
};
