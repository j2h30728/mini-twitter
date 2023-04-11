import Link from "next/link";
import { useForm } from "react-hook-form";

interface AccountForm {
  name: string;
  email: string;
  password: string;
}
export default function createAccount() {
  const { register, handleSubmit, reset } = useForm<AccountForm>();

  const onValid = (valiform: AccountForm) => {
    console.log(valiform);
    reset();
  };

  return (
    <>
      <h1>회원가입</h1>
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
          <label>Name</label>
          <input
            {...register("name", { required: true })}
            type="text"
            placeholder="Name을 입력해주세요."
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
        <button>회원가입하기</button>
      </form>
      <div>
        <span>이미 계정이 있으신가요?</span>
        <Link href="/log-in">로그인 하러가기</Link>
      </div>
    </>
  );
}
