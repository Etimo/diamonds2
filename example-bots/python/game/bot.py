import requests
import json
from .board import Board
import hashlib


class Bot(object):
    def __init__(self, email, name, api):
        self.email = email
        self.name = name
        self.api = api

    def _get_direction(self, dx, dy):
        if dx == -1 and dy == 0:
            return "LEFT"
        elif dx == 1 and dy == 0:
            return "RIGHT"
        elif dx == 0 and dy == -1:
            return "UP"
        elif dx == 0 and dy == 1:
            return "DOWN"
        else:
            raise Exception("Invalid move")

    def get_my_info(self):
        req = self.api.bots_get(self.bot_token)
        if req.status_code == 200:
            result = req.json()
            self.name = result["name"]

    def register(self):
        req = self.api.bots_register(self.name, self.email)

        if req.status_code == 200:
            result = req.json()
            self.bot_token = result["token"]
        return req

    def list_boards(self):
        req = self.api.boards_list()

        if req.status_code == 200:
            return map(lambda x: Board(x), req.json())

    def join(self, board_id):
        return self.api.boards_join(board_id, self.bot_token)

    def get_board(self, board_id):
        req = self.api.boards_get(board_id)
        if req.status_code == 200:
            return Board(req.json())

    def move(self, board_id, dx, dy):
        return self.api.boards_move(
            board_id, self._get_direction(dx, dy), self.bot_token
        )
