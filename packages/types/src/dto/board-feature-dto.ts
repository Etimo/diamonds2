import {
  BotProviderConfig,
  DiamondProviderConfig,
  TeleportProviderConfig,
  TeleportRelocationProviderConfig,
} from "../gameobject";

export type IBaseFeatureDto = {
  name: "BaseProvider";
  config: null;
};

export type ITeleportFeatureDto = {
  name: "TeleportProvider";
  config: TeleportProviderConfig;
};

export type ITeleportRelocationFeatureDto = {
  name: "TeleportRelocationProvider";
  config: TeleportRelocationProviderConfig;
};

export type IDiamondFeatureDto = {
  name: "DiamondProvider";
  config: DiamondProviderConfig;
};

export type IDiamondButtonFeatureDto = {
  name: "DiamondButtonProvider";
  config: null;
};

export type IBotFeatureDto = {
  name: "BotProvider" | "DummyBotProvider";
  config: BotProviderConfig;
};

export type IBoardFeatureDto =
  | IBaseFeatureDto
  | ITeleportFeatureDto
  | ITeleportRelocationFeatureDto
  | IDiamondFeatureDto
  | IDiamondButtonFeatureDto
  | IBotFeatureDto;
