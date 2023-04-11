import React from "react";

import useUser from "../lib/client/useUser";

export default function Home() {
  const { data, isLoading } = useUser();

  return !isLoading ? (
    <div>
      <h1>name : {data?.name}</h1>
      <h1>email : {data?.email}</h1>
      <h1>tweet : {data?.tweet}</h1>
    </div>
  ) : (
    "Loading"
  );
}
