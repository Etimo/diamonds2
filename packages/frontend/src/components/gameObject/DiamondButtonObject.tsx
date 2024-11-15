import type { FC } from "react";
import { redButton } from "../images/index.ts";
import { CommonGameObject } from "./CommonGameObject.tsx";

export const DiamondButtonComponent: FC = () => (
  <CommonGameObject characterImg={redButton} />
);
