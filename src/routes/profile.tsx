import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { Form, Input } from "../components/auth-components";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Email = styled.div`
  opacity: 0.5;
`;
const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;
const ProfileInf = styled.div`
  width: 100%;
  padding: 20px;
  height: 50%;
  border: solid 1px white;
`;
const EditButton = styled.div`
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  border: solid 1px white;
  padding: 10px;
  cursor: pointer;
`;
const Bottom = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
`;
const Inf = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const Edit = styled.div``;
const ProfileBackground = styled.div`
  width: 100%;
  height: 30%;
`;

const Modal = styled.div`
  width: 100%;
  height: 40%;

  display: flex;
  align-items: center;
`;

const Cutton = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export default function Profile() {
  const user = auth.currentUser;

  const { register, handleSubmit } = useForm();
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [clickEdit, setClickEdit] = useState(false);

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  const onSubmit = async (data: any) => {
    console.log(data);
    if (!user) return;
    await updateProfile(user, { displayName: data.nickname });
    setClickEdit(false);
  };
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  return (
    <Wrapper>
      <ProfileInf>
        <ProfileBackground></ProfileBackground>
        <Bottom>
          <Inf>
            {" "}
            <AvatarUpload htmlFor="avatar">
              {avatar ? (
                <AvatarImg src={avatar} />
              ) : (
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                </svg>
              )}
            </AvatarUpload>
            <AvatarInput
              onChange={onAvatarChange}
              id="avatar"
              type="file"
              accept="image/*"
            />
            <Name>{user?.displayName ?? "Anonymous"}</Name>
            <Email>@{user?.email?.substring(0, user.email.indexOf("@"))}</Email>
          </Inf>
          <Edit>
            {" "}
            <EditButton onClick={() => setClickEdit(true)}>
              edit profile
            </EditButton>
          </Edit>
        </Bottom>
      </ProfileInf>

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
      {clickEdit ? (
        <>
          <Cutton>
            <Modal>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  {...register("nickname")}
                  name="nickname"
                  placeholder="Nickname"
                ></Input>
                <Input type="submit" value="닉네임 변경" />
              </Form>
            </Modal>
          </Cutton>
        </>
      ) : null}
    </Wrapper>
  );
}
