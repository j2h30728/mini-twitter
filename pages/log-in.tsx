import Link from "next/link";
import { useForm } from "react-hook-form";

interface AccountForm {
  name: string;
  email: string;
  password: string;
}
export default function login() {
  const { register, handleSubmit, reset } = useForm<AccountForm>();

  const onValid = (valiform: AccountForm) => {
    console.log(valiform);
    reset();
  };

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
