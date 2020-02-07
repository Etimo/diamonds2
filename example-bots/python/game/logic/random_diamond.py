import random
from ..util import get_direction, position_equals


class RandomDiamondLogic(object):
    def __init__(self):
        self.goal_position = None

    def next_move(self, board_bot, board):
        props = board_bot["properties"]
        current_position = board_bot["position"]

        # Analyze new state
        if props["diamonds"] == 5:
            # Move to base if we are full of diamonds
            base = props["base"]
            self.goal_position = base
        elif self.goal_position is None or position_equals(
            current_position, self.goal_position
        ):
            # Move towards a random diamond on board
            self.goal_position = board.diamonds[
                int(len(board.diamonds) * random.random())
            ].get('position')

        if self.goal_position:
            # Calculate move according to goal position
            delta_x, delta_y = get_direction(
                current_position["x"],
                current_position["y"],
                self.goal_position["x"],
                self.goal_position["y"],
            )
            return delta_x, delta_y

        return 0, 0
