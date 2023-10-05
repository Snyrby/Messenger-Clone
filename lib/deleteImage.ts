export const deleteImage = async (imageId: string) => {
  try {
    let origin = "";
    if (process.env.NODE_ENV === "development") {
      origin = "http://localhost:3000";
    } else if (process.env.NODE_ENV === "production") {
      origin = process.env.NEXTAUTH_URL as string;
    }
    await fetch(`${origin}/api/delete-image`, {
      method: "POST",
      body: JSON.stringify({ id: imageId }),
    });
    return;
  } catch (error) {
    throw error;
  }
};
