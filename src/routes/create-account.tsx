import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { Form, Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Input, Switcher, Title, Wrapper } from "../components/auth-components";

export default function CreateAccount() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState(false);
  const passwordError = errors?.password;
  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(credentials.user, {
        displayName: data.name,
      });
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        alert(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("name")} placeholder="Name" type="text" required />
        <Input {...register("email")} placeholder="Email" type="email" />
        <Input
          {...register("password", {
            required: true,
            pattern:
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          })}
          name="password"
          placeholder="Password"
          type="password"
        />
        {passwordError ? <p>패스워드 입력이 잘못되었습니다.</p> : undefined}
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
