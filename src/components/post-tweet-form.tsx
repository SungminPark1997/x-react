import { useState } from "react";
import { useForm } from "react-hook-form";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ITweet } from "./timeline";
import { useRecoilState } from "recoil";
import { isEdit } from "../atoms";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const AttachFileInput = styled.input`
  display: none;
`;

export const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
interface PostTweetFormProps {
  username?: string;
  photo?: string;
  tweet?: string;
  userId?: string;
  id?: string;
  childrenEdit: () => void;
}
export default function PostTweetForm({
  username,
  photo,
  tweet,
  userId,
  id,
  childrenEdit,
}: PostTweetFormProps) {
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (file) {
      setFile(e.target.files ? e.target.files[0] : file);
    }
    setFile(e.target.files ? e.target.files[0] : null);
    setFileSelected(!!e.target.files?.length);
  };
  const onSubmit = async (data: any) => {
    const obj = { username, photo, tweet, userId, id };
    const user = auth.currentUser;
    if (obj.id) {
      const tweetRef = doc(db, "tweets", obj.id);
      if (obj.photo) {
        setLoading(true);
        try {
          await updateDoc(tweetRef, {
            tweet: data?.tweet,
            createdAt: Date.now(),
          });
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
          childrenEdit();
        }
      } else {
        setLoading(true);
        try {
          await updateDoc(tweetRef, {
            tweet: data.tweet,
            createdAt: Date.now(),
          });
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
          childrenEdit();
        }
      }
    } else {
      if (!user || isLoading) return;

      try {
        setLoading(true);
        const doc = await addDoc(collection(db, "tweets"), {
          tweet: data?.tweet,
          createdAt: Date.now(),
          username: user.displayName || "Anonymous",
          userId: user.uid,
        });

        if (file) {
          const locationRef = ref(
            storage,
            `tweets/${user.uid}-${user.displayName}/${doc.id}`
          );
          const result = await uploadBytes(locationRef, file);
          const url = await getDownloadURL(result.ref);
          await updateDoc(doc, {
            photo: url,
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextArea
        {...register("tweet", { required: true, maxLength: 180 })}
        rows={5}
        placeholder={id ? "Editing..." : "What is happening?!"}
      />
      <AttachFileButton htmlFor="file">
        {fileSelected ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        {...register("file")}
        type="file"
        id="file"
        accept="*"
        name="file"
        onChange={onFileChange}
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Tweet"}
      />
    </Form>
  );
}
