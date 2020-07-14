import React, { useState } from "react";
import Layout from "../blocks/Layout";
import TeamsTable from "../components/TeamsTable";

export default () => {
  return (
    <Layout.Game>
      <Layout.Tables>
        <TeamsTable></TeamsTable>
      </Layout.Tables>
    </Layout.Game>
  );
};
