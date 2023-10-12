"use client";

import Modal from "@/components/Modal";
import Button from "@/components/ui/Button";
import useConversation from "@/hooks/useConversation";
import { deleteImage } from "@/lib/deleteImage";
import { Dialog } from "@headlessui/react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

type ConfirmModalProps = {
  isOpen?: boolean;
  onClose: () => void;
};

type messageProps = {
  imageId: string;
}

const ConfirmModal = ({ isOpen, onClose }: ConfirmModalProps) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = useCallback(async () => {
    setIsLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then((response: AxiosResponse) => {
        console.log(response.data);
        response.data.map((message: messageProps) => {
          deleteImage(message.imageId)
        })
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete Conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation? This action
              can't be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button type="button" disabled={isLoading} danger onClick={onDelete}>
          {isLoading ? "Deleting" : "Delete"}
        </Button>
        <Button type="button" disabled={isLoading} secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
