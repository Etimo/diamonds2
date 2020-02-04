def clamp(n, smallest, largest):
    return max(smallest, min(n, largest))


def get_direction(current_x, current_y, dest_x, dest_y):
    delta_x = clamp(dest_x - current_x, -1, 1)
    delta_y = clamp(dest_y - current_y, -1, 1)
    if delta_x != 0:
        delta_y = 0
    return (delta_x, delta_y)


def position_equals(a, b):
    return a["x"] == b["x"] and a["y"] == b["y"]
