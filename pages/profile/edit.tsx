import { withSsrSession } from "@/lib/server/withSession";
import { NextPage, NextPageContext } from "next";
import { SWRConfig } from "swr";
import db from "../../lib/server/db";
import Layout from "../../components/layout";
import { userProfile } from "@/types/users";
import { useForm } from "react-hook-form";
import Input from "@/components/input";
import useMutation from "@/lib/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/button";

interface EditProfile {
  name: string;
  bio: string;
}
interface EidtProfileResponse {
  success: boolean;
  updateProfile: userProfile;
}

const Profile: NextPage<{ user: userProfile }> = ({ user }) => {
  const { register, handleSubmit } = useForm<EditProfile>({
    defaultValues: { name: user?.name, bio: user?.profile?.bio },
  });
  const router = useRouter();
  const [editProfile, { data, loading, error: editError }] =
    useMutation<EidtProfileResponse>("/api/users/profile");
  const handleEidt = (eidtData: EditProfile) => {
    if (loading) return;
    if (confirm("수정하시겠습니까?"))
      editProfile({ data: eidtData, method: "PUT" });
  };
  useEffect(() => {
    if (data && data.success) router.push("/profile");
    if (!data?.success && editError) {
      alert(editError);
    }
  }, [data]);
  return (
    <Layout title="회원정보수정" hasTabBar>
      <form
        onSubmit={handleSubmit(handleEidt)}
        className="w-full p-11 mt-20 space-y-4">
        <Input
          name="name"
          label="이름"
          type="text"
          register={register("name")}
          required
        />
        <Input
          name="bio"
          label="자기소개"
          kind="textarea"
          register={register("bio")}
          required={false}
        />
        <Button text="회원정수정" large />
      </form>
    </Layout>
  );
};

const Page: NextPage<{ user: userProfile }> = ({ user }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/profile": { success: true, user },
        },
      }}>
      <Profile user={user} />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const user = await db.user.findUnique({
    where: { id: req?.session.user?.id },
    include: {
      profile: {
        select: {
          bio: true,
        },
      },
    },
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
});
export default Page;
