import type { BotGameObjectProperties } from "@etimo/diamonds2-types";
import { type FC, memo } from "react";
import { robot } from "../images/index.ts";
import { CommonGameObject } from "./CommonGameObject.tsx";

export const BotComponent: FC<BotGameObjectProperties> = memo(({ name }) => (
  <CommonGameObject characterName={name} characterImg={robot} index={10} />
));
