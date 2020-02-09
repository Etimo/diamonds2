import React from "react";
import _ from "lodash";
import Board from "../blocks/Board";
import {
  BaseGameObject,
  BotGameObject,
  DiamondButtonGameObject,
  DiamondGameObject1,
  DiamondGameObject2,
  TeleporterGameObject,
} from "../images";

export default ({ rows }) => {
  /** Set of mappers for special game objects (i.e. not a 1-to-1 mapping of type to filename) */
  const imageNameMappers = {
    "DiamondGameObject": (go) => go.type + go.properties.points
  }

  const imageMap = {
    DiamondButtonGameObject: DiamondButtonGameObject,
    BotGameObject: BotGameObject,
    BaseGameObject: BaseGameObject,
    DiamondGameObject1: DiamondGameObject1,
    DiamondGameObject2: DiamondGameObject2,
    TeleportGameObject: TeleporterGameObject,
  };

  const decideImageName = content => {
    if (content.type in imageNameMappers) {
      return imageNameMappers[content.type](content);
    }
    return content.type;
  }

  const decideCharacter = content => {
    return imageMap[decideImageName(content)];
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
            {cells.map((items, key) => {

              return (
                <Board.Cell
                  key={key}
                  bigCellSize={bigCellSize}
                  smallCellSize={smallCellSize}
                >
                  {items.map((content, key) => {
                    const character = decideCharacter(content);
                    const characterName = decideCharacterName(content);
                    const shouldRotate = content.goName === "Teleporter" ? 1 : 0;
                    if (characterName) {
                        return (
                          <Board.CharacterName>{characterName}</Board.CharacterName>
                        )
                    }
                    if (character) {
                      return (
                        <Board.CharacterImg
                          key={key}
                          alt="player"
                          src={character}
                          rotate={shouldRotate}
                        />
                      )
                    }
                  })}
                </Board.Cell>
              );
            })}
          </Board.Row>
        );
      })}
    </Board>
  );
};
