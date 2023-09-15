import { TeleportProviderConfig } from "../gameobject";

export type BaseFeatureDto = {
  name: string;
};

export type TeleportFeatureDto = {
  name: "TeleportProvider";
  config: TeleportProviderConfig;
};

export type BoardFeatureDto = TeleportFeatureDto;
