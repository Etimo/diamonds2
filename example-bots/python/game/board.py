class Board(object):
    def __init__(self, data):
        self.id = data["id"]
        self.width = data["width"]
        self.height = data["height"]
        self.gameObjects = data["gameObjects"]
        self.bots = self._get_by_type("BotGameObject")
        self.diamonds = self._get_by_type("DiamondGameObject")
        self.data = data

    def _get_by_type(self, t):
        return [d for d in self.gameObjects if d["type"] == t]

    def get_bot(self, bot):
        for item in self.bots:
            if item.get("properties", {}).get("name") == bot.name:
                return item
