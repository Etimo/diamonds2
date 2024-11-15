import type { DiamondGameObjectProperties } from "@etimo/diamonds2-types";
import { type FC, memo } from "react";
import { diamond, diamondRed } from "../images/index.ts";
import { CommonGameObject } from "./CommonGameObject.tsx";
import { SparklesComponent } from "./SparklesComponent.tsx";

export const DiamondComponent: FC<DiamondGameObjectProperties> = memo(
  ({ points }) => {
    const characterImg = points === 2 ? diamondRed : diamond;
    return (
      <>
        <CommonGameObject
          characterImg={characterImg}
          imageClassName="diamond"
        />
        <SparklesComponent />
      </>
    );
  },
);
