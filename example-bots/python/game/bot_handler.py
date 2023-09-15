import requests
import json
import hashlib
from dataclasses import dataclass
from game.api import Api
from game.models import Bot, Board
from typing import Optional


@dataclass
class BotHandler:
    api: Api

    @staticmethod
    def _get_direction(dx: int, dy: int):
        if dx == -1 and dy == 0:
            return "WEST"
        elif dx == 1 and dy == 0:
            return "EAST"
        elif dx == 0 and dy == -1:
            return "NORTH"
        elif dx == 0 and dy == 1:
            return "SOUTH"
        else:
            raise Exception("Invalid move")


    def get_my_info(self, token: str) -> Bot:
        return self.api.bots_get(token)


    def join(self, token: str, board_id: int ) -> bool:
        return self.api.boards_join(token, board_id)

    def move(self, token: str, board_id: int, dx: int, dy: int) -> Optional[Board]:
        # TODO: Returns board??
        return self.api.boards_move(
            board_id, BotHandler._get_direction(dx, dy), token
        )

    def register(self, name: str, email: str, password: str, team: str) -> Optional[Bot]:
        return self.api.bots_register(name, email, password, team)
