import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useMutation from "../lib/client/useMutation";
import { ResponseType } from "../lib/server/withHandler";

interface AccountForm {
  name: string;
  email: string;
  password: string;
}

export default function signUp() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AccountForm>();
  const [mutation, { loading, data }] =
    useMutation<ResponseType>("/api/users/signUp");

  const onValid = (validForm: AccountForm) => {
    console.log(validForm);
    reset();
    if (loading) return;
    mutation({ data: validForm, method: "POST" });
  };
  useEffect(() => {
    if (data) {
      if (data.success) {
        alert(data?.message);
        router.replace("/log-in");
      } else {
        alert(data?.message);
      }
    }
  }, [data]);
  return (
    <>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <label>Name:</label>
          <input {...register("name", { required: true })} type="text" />
        </div>
        <div>
          <label>Email:</label>
          <input {...register("email", { required: true })} type="email" />
        </div>
        <div>
          <label>password:</label>
          <input
            {...register("password", { required: true })}
            type="password"
          />
        </div>
        <button>회원가입</button>
      </form>
      <span>계정이 있으신가요?</span>
      <Link href="/log-in">로그인 하러가기</Link>
    </>
  );
}
