import type { FC } from "react";
import { teleporter } from "../images/index.ts";
import { CommonGameObject } from "./CommonGameObject.tsx";

export const TeleportComponent: FC = () => (
  <CommonGameObject characterImg={teleporter} imageClassName={"rotate"} />
);
