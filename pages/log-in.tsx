import Link from "next/link";
import { useForm } from "react-hook-form";
import useMutation from "@/lib/client/useMutation";
import { useEffect } from "react";
import { ResponseType } from "@/lib/server/withHandler";
import { useRouter } from "next/router";
import Input from "@/components/input";
import Button from "@/components/button";
import Layout from "@/components/layout";

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
    if (loading) return;
    mutation({ data: valiform, method: "POST" });
    reset();
  };
  useEffect(() => {
    if (data) {
      if (data.success) {
        router.push("/");
      } else {
        alert(data.message);
      }
    }
  }, [data, router]);
  return (
    <Layout title="로그인">
      <div className="h-screen p-11 mt-20 space-y-8">
        <form onSubmit={handleSubmit(onValid)} className="w-full space-y-4">
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
          <Button large text="로그인" />
        </form>
        <div className="mt-5 flex gap-4">
          <span>처음 이신가요?</span>
          <Link
            href="/create-account"
            className="font-bold hover:text-point activ:text-pointFocus">
            회원가입 하러가기
          </Link>
        </div>
      </div>
    </Layout>
  );
}
