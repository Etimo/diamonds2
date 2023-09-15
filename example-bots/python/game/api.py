import json
from dataclasses import dataclass
from typing import List, Optional, Tuple, Union

import requests
from colorama import Back, Fore, Style, init
from dacite import from_dict
from decode import decode
from game.models import Board, Bot
from requests import Response


@dataclass
class Api:
    url: str

    def _get_url(self, endpoint: str) -> str:
        return "{}{}".format(self.url, endpoint)

    def _req(self, endpoint: str, method: str, body: dict) -> Response:
        print(
            ">>> {} {} {}".format(
                Style.BRIGHT + method.upper() + Style.RESET_ALL,
                Fore.GREEN + endpoint + Style.RESET_ALL,
                body,
            )
        )
        func = getattr(requests, method)
        headers = {"Content-Type": "application/json"}
        req = func(self._get_url(endpoint),
                   headers=headers, data=json.dumps(body))
        print("<<< {} {}".format(req.status_code, req.text))
        return req

    def bots_get(self, bot_token: str) -> Optional[Bot]:
        response = self._req("/bots/{}".format(bot_token), "get", {})
        data, status =  self._return_response_and_status(response)
        if status == 200:
            return from_dict(Bot, data)
        return None

    def bots_register(self, name: str, email: str, password: str, team: str) -> Optional[Bot]:
        response = self._req("/bots", "post", {"email": email, "name": name, "password": password, "team": team})
        resp, status = self._return_response_and_status(response)
        if status == 200:
            return from_dict(Bot, resp)
        return None

    def boards_list(self) -> Optional[List[Board]]:
        response = self._req("/boards", "get", {})
        resp, status = self._return_response_and_status(response)
        if status == 200:
            return [from_dict(Board, board) for board in resp]
        return None


    def bots_join(self, bot_token: str, board_id: int) -> bool:
        response = self._req(
            f"/bots/{bot_token}/join", "post", {"preferredBoardId": board_id}
        )

        resp, status =  self._return_response_and_status(response)
        if status == 200:
            return True
        return False

    def boards_get(self, board_id: str) -> Optional[Board]:
        response = self._req("/boards/{}".format(board_id), "get", {})
        resp, status =  self._return_response_and_status(response)
        if status == 200:
            return from_dict(Board, resp)
        return None

    def bots_move(self, bot_token: str, direction: str) -> Optional[Board]:
        response = self._req(
            "/bots/{}/move".format(bot_token),
            "post",
            {"direction": direction},
        )
        resp, status =  self._return_response_and_status(response)
        if status == 200:
            return from_dict(Board, resp)
        return None

    def _return_response_and_status(self, response: Response) -> Tuple[Union[dict, List], int]:
        resp = response.json()

        response_data = resp.get("data") if isinstance(resp, dict) else resp
        if not response_data:
            response_data = resp

        return decode(response_data), response.status_code
