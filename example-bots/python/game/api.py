import requests
import json
from colorama import init, Fore, Back, Style


class Api(object):
    def __init__(self, url):
        self.url = url

    def _get_url(self, endpoint):
        return "{}{}".format(self.url, endpoint)

    def _req(self, endpoint, method, body):
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

    def bots_get(self, bot_token):
        response = self._req("/bots/{}".format(bot_token), "get", {})
        return self._return_response_and_status(response)

    def bots_register(self, name, email, password, team):
        response = self._req("/bots", "post", {"email": email, "botName": name, "password": password, "team": team})
        return self._return_response_and_status(response)

    def boards_list(self):
        response = self._req("/boards", "get", {})
        return self._return_response_and_status(response)

    def boards_join(self, board_id, bot_token):
        response = self._req(
            "/boards/{}/join".format(board_id), "post", {"botToken": bot_token}
        )
        return self._return_response_and_status(response)

    def boards_get(self, board_id):
        response = self._req("/boards/{}".format(board_id), "get", {})
        return self._return_response_and_status(response)

    def boards_move(self, board_id, direction, bot_token):
        response = self._req(
            "/boards/{}/move".format(board_id),
            "post",
            {"direction": direction, "botToken": bot_token},
        )
        return self._return_response_and_status(response)

    def _return_response_and_status(self, response):
        try:
            resp = response.json()['data']
        except KeyError:
            resp = response.json()

        return resp, response.status_code
