import type { BaseGameObjectProperties } from "@etimo/diamonds2-types";
import { type FC, memo } from "react";
import { base } from "../images/index.ts";
import { CommonGameObject } from "./CommonGameObject.tsx";

export const BaseComponent: FC<BaseGameObjectProperties> = memo(({ name }) => (
  <CommonGameObject characterName={name} characterImg={base} />
));
