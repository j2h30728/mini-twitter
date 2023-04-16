import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useMutation from "../lib/client/useMutation";
import { ResponseType } from "../lib/server/withHandler";
import Layout from "@/components/layout";
import Input from "@/components/input";
import Button from "@/components/button";

interface AccountForm {
  name: string;
  email: string;
  password: string;
}

export default function signUp() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AccountForm>();
  const [mutation, { loading, data, error }] =
    useMutation<ResponseType>("/api/users/signUp");

  const onValid = (validForm: AccountForm) => {
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
  useEffect(() => {
    if (data && !data.success) alert(error);
  }, [error]);

  return (
    <Layout title="회원가입">
      <div className="max-h-fit w-full mt-20 p-11  space-y-5">
        <form onSubmit={handleSubmit(onValid)} className="w-full space-y-4">
          <Input
            label="이름"
            name="name"
            register={register("name", { required: true })}
            type="text"
            required
          />
          <Input
            label="이메일"
            name="email"
            register={register("email", { required: true })}
            type="email"
            required
          />
          <Input
            label="비밀번호"
            name="password"
            register={register("password", { required: true })}
            type="password"
            required
          />
          <Button large text="회원가입" />
        </form>
        <div className="mt-5 flex gap-4">
          <span>계정이 있으신가요?</span>
          <Link
            href="/log-in"
            className="font-bold hover:text-point activ:text-pointFocus">
            로그인 하러가기
          </Link>
        </div>
      </div>
    </Layout>
  );
}
