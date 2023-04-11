import Link from "next/link";
import { useForm } from "react-hook-form";
import useMutation from "../lib/client/useMutation";
import { useEffect } from "react";
import { ResponseType } from "../lib/server/withHandler";
import { useRouter } from "next/router";

interface AccountForm {
  name: string;
  email: string;
  password: string;
}
export default function login() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AccountForm>();
  const [mutation, { loading, data, error }] =
    useMutation<ResponseType>("/api/users/login");

  const onValid = (valiform: AccountForm) => {
    console.log(valiform);
    if (loading) return;
    mutation({ data: valiform, method: "POST" });
    reset();
  };
  useEffect(() => {
    console.log(data);
    if (data) {
      if (data.success) {
        console.log(data);
        router.replace("/tweet");
      } else {
        alert(data.message);
      }
    }
  }, [data]);
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onValid)}>
        <div>
          <label>Email</label>
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email을 입력해주세요."
          />
        </div>
        <div>
          <label>Password</label>
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="최소 8자 이상 입력해주세요"
          />
        </div>
        <button>로그인하기</button>
      </form>
      <div>
        <span>처음 이신가요?</span>
        <Link href="/create-account">회원가입 하러가기</Link>
      </div>
    </>
  );
}
