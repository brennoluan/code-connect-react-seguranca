"use client";

import { useState } from "react";
import { IconButton } from "../IconButton";
import { Spinner } from "../Spinner";
import { ThumbsUp } from "../icons/ThumbsUp";
import { useFormStatus } from "react-dom";
export const ThumbsUpButton = ({ postId, onLikeSuccess }) => {
  const { pending } = useFormStatus();
  return (
    <IconButton disabled={pending}>
      {pending ? <Spinner /> : <ThumbsUp />}
    </IconButton>
  );
};
