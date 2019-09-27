import random
from ..util import get_direction


class FirstDiamondLogic(object):
    def __init__(self):
        self.goal_position = None

    def next_move(self, board_bot, board):
        props = board_bot["properties"]

        # Analyze new state
        if props["diamonds"] == 5:
            # Move to base if we are full of diamonds
            base = props["base"]
            self.goal_position = base
        else:
            # Move towards first diamond on board
            self.goal_position = board.diamonds[0]

        if self.goal_position:
            # Calculate move according to goal position
            current_position = board_bot["position"]
            delta_x, delta_y = get_direction(current_position["x"], current_position["y"], self.goal_position["x"], self.goal_position["y"])
            return delta_x, delta_y

        return 0, 0
