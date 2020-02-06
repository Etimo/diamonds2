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
      DiamondButton: redButton
    };

    if (
      _.has(content, "botName") &&
      _.has(content, "base") &&
      _.has(content, "diamond")
    ) {
      return botBaseDiamond;
    } else if (_.has(content, "botName") && _.has(content, "base")) {
      return botBase;
    } else if (_.has(content, "botName") && _.has(content, "diamond")) {
      return botDiamond;
    } else if (_.has(content, "base")) {
      return base;
    } else if (_.has(content, "botName")) {
      return robot;
    } else if (_.has(content, "diamond")) {
      return content.points === 1 ? diamond : diamondRed;
    } else if (_.has(content, "go")) {
      return goImgMap[content.goName];
    } else {
      return null;
    }
  };

  const decideCharacterName = content => {
    if (_.has(content, "botName")) {
      return content.botName;
    } else if (_.has(content, "base")) {
      return content.base;
    } else {
      return null;
    }
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
