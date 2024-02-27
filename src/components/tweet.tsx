import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { deleteObject, ref } from "firebase/storage";
import { EllipsisHorizontalIcon } from "./arrow-right";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { isModal } from "../atoms";
import { Navigate, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  padding-right: 0px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin: 10px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 15px;
`;
const IconContainer = styled.div`
  cursor: pointer;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
const Icon = styled(EllipsisHorizontalIcon)`
  width: 48px;
`;
const Modal = styled.div`
  width: 100px;
  height: 200px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: grid;
  grid-template-row: 1fr 1fr 1fr 1fr 1fr;

  margin-right: 20px;
`;

const ModalItem = styled.div`
  display: flex;
  justify-content: center;
  &:first-child {
    color: red;
  }
`;
export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;

  const [modal, setModal] = useState(false);
  const onClick = () => {
    setModal(!modal);
  };
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  return (
    <Wrapper onClick={onClick}>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {photo ? <Photo src={photo} /> : null}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>

      <Column>
        <IconContainer onClick={onClick}>
          <Icon />
          {modal ? (
            <Modal>
              {user?.uid === userId ? (
                <ModalItem onClick={onDelete}>삭제하기</ModalItem>
              ) : (
                <ModalItem onClick={onDelete}>해당 게시물 추천 안함</ModalItem>
              )}
              <ModalItem>수정하기</ModalItem>
              <ModalItem></ModalItem>
            </Modal>
          ) : null}
        </IconContainer>
      </Column>
    </Wrapper>
  );
}
