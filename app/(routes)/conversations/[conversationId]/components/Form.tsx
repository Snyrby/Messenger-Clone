"use client";

import Button from "@/components/ui/Button";
import MessageInput from "@/components/ui/MessageInput";
import Image from "next/image";
import useConversation from "@/hooks/useConversation";
import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { uploadImage } from "@/lib/imageUpload";

const Form = () => {
  const hiddenFileInput = useRef(null);
  const { conversationId } = useConversation();
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue("message", "", { shouldValidate: true });
    await axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if (!file) return;
    if (!file.type.includes("image")) {
      return alert("Please upload an image file");
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      setImage(result);
    };
  };

  const handleImageUpload = async () => {
    setIsLoading(true);
    const newImage = await uploadImage(image);
    await axios.post("/api/messages", {
      image: newImage?.url,
      imageId: newImage?.public_id,
      conversationId,
    });
    setImage("");
    //@ts-ignore
    hiddenFileInput.current.value = "";
    setIsLoading(false);
  };

  const handleClick = () => {
    //@ts-ignore
    hiddenFileInput.current.click();
  };
  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      {image !== "" && (
        <>
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleImageUpload}
          >
            {isLoading ? "Sending" : "Send"}
          </Button>
          <Button
            disabled={isLoading}
            type="button"
            secondary
            onClick={() => {
              //@ts-ignore
              hiddenFileInput.current.value = "";
              setImage("");
            }}
          >
            Cancel
          </Button>
          <Image
            width={400}
            height={400}
            src={image}
            className="object-cover"
            alt="image"
          />
        </>
      )}
      <input
        name="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        ref={hiddenFileInput}
      />
      {image === "" && (
        <>
          <HiPhoto
            onClick={handleClick}
            size={30}
            className="text-sky-500 cursor-pointer"
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2 lg:gap-4 w-full"
          >
            <MessageInput
              id="message"
              register={register}
              errors={errors}
              required
              placeholder="Write a message"
            />
            <button
              type="submit"
              className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
              disabled={!!image || isSubmitting}
            >
              <HiPaperAirplane size={18} className="text-white" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Form;
