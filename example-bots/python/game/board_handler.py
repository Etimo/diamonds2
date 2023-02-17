from dataclasses import dataclass
from typing import Union, List
from game.api import Api
from game.models import Board

@dataclass
class BoardHandler:
    api: Api

    def list_boards(self) -> List[Board]:
        return self.api.boards_list()

    def get_board(self, board_id: int) -> Board:
        return self.api.boards_get(board_id)
