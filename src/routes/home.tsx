import { styled } from "styled-components";
import logout from "../components/auth-components";
import { auth } from "../firebase";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";
const Wrapper = styled.div``;
export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
