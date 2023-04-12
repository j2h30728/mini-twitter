import { useForm } from "react-hook-form";

interface Tweet {
  tweet: string;
}

export default function tweet() {
  const { register, handleSubmit } = useForm<Tweet>();

  const onValid = (tweetData: Tweet) => {
    console.log(tweetData);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onValid)}>
        <input {...register("tweet")} placeholder="트윗을 작성해 주세요." />
        <button>트윗하기</button>
      </form>
    </>
  );
}
