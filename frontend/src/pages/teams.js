import React, { useState } from "react";
import Layout from "../blocks/Layout";
import TeamsTable from "../components/TeamsTable";
import Header from "../components/Header";

export default () => {
  return (
    <Layout>
      <Header />
      <Layout.Game>
        <Layout.Tables>
          <TeamsTable></TeamsTable>
        </Layout.Tables>
      </Layout.Game>
    </Layout>
  );
};
