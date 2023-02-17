import re

def _unpack(data):
    if isinstance(data, dict):
        return data.items()
    return data
  
def _snake_case(value):
    """
    Convert camel case string to snake case
    :param value: string
    :return: string
    """
    first_underscore = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', value)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', first_underscore).lower()


def _keys_to_snake_case(content):
    """
    Convert all keys for given dict to snake case
    :param content: dict
    :return: dict
    """
    return {_snake_case(key): value for key, value in content.items()}

def decode_keys(data):
    """
    Convert all keys for given dict/list to snake case recursively
    :param data: dict
    :return: dict
    """
    formatted = {}
    for key, value in _unpack(_keys_to_snake_case(data)):
        if isinstance(value, dict):
            formatted[key] = decode_keys(value)
        elif isinstance(value, list) and len(value) > 0:
            formatted[key] = []
            for _, val in enumerate(value):
                formatted[key].append(decode_keys(val))
        else:
            formatted[key] = value
    return formatted

def decode(data):
    if isinstance(data, dict):
        return decode_keys(data)

    formatted = []
    for item in data:
        formatted.append(decode_keys(item))
    return formatted