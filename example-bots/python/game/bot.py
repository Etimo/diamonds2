import requests
import json
from .board import Board
import hashlib


class Bot(object):
    def __init__(self, email, name, password, team, api):
        self.email = email
        self.name = name
        self.password = password
        self.team = team
        self.api = api
        

    def _get_direction(self, dx, dy):
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

    def get_my_info(self):
        resp, status = self.api.bots_get(self.bot_token)
        if status == 200:
            self.name = resp["botName"]

    def register(self):
        resp, status = self.api.bots_register(self.name, self.email, self.password, self.team)

        if status == 200:
            self.bot_token = resp["token"]
        return resp, status

    def list_boards(self):
        resp, status = self.api.boards_list()
        if status == 200:
            return [Board(x) for x in resp]

    def join(self, board_id):
        return self.api.boards_join(board_id, self.bot_token)

    def get_board(self, board_id):
        resp, status = self.api.boards_get(board_id)
        if status == 200:
            return Board(resp)

    def move(self, board_id, dx, dy):
        return self.api.boards_move(
            board_id, self._get_direction(dx, dy), self.bot_token
        )
