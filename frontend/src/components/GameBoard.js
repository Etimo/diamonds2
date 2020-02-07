import React from "react";
import _ from "lodash";
import Board from "../blocks/Board";
import {
  base,
  botBaseDiamond,
  botBase,
  diamond,
  diamondRed,
  botDiamond,
  robot,
  teleporter,
  wall,
  redButton
} from "../images";

export default ({ rows }) => {
  const decideCharacter = content => {
    const goImgMap = {
      Teleporter: teleporter,
      Wall: wall,
      DiamondButtonGameObject: redButton,
      DiamondGameObject: diamond,
      RedDiamond: diamondRed,
      BotGameObject: robot,
      BaseGameObject: base,
      BotGameObjectBaseGameObject: botBase,
      BaseGameObjectBotGameObject: botBase,
      DiamondGameObjectBotGameObject: botDiamond,
      BotGameObjectDiamondGameObject: botDiamond,
      TeleportGameObject: teleporter
    };
    return goImgMap[content.type];
  };

  const decideCharacterName = content => {
    if (_.has(content.properties, "name")) {
      return content.properties.name;
    }
    return null;
  };

  const width = rows.length;
  const bigCellSize = (90 / width).toFixed(2);
  const smallCellSize = (60 / width).toFixed(2);

  return (
    <Board>
      {rows.map((cells, key) => {
        return (
          <Board.Row key={key}>
            {cells.map((content, key) => {
              const character = decideCharacter(content);
              const characterName = decideCharacterName(content);
              const shouldRotate = content.goName === "Teleporter" ? 1 : 0;

              return (
                <Board.Cell
                  key={key}
                  bigCellSize={bigCellSize}
                  smallCellSize={smallCellSize}
                >
                  {characterName && (
                    <Board.CharacterName>{characterName}</Board.CharacterName>
                  )}
                  {character && (
                    <Board.CharacterImg
                      alt="player"
                      src={character}
                      rotate={shouldRotate}
                    />
                  )}
                </Board.Cell>
              );
            })}
          </Board.Row>
        );
      })}
    </Board>
  );
};
