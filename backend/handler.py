"""Handle serverless integration with project code."""
import json
from get_events import get_official_events


def find_townhalls(event, context):
    """Entry point for the /find_townhalls url."""
    # address = event['pathParameters']['address']

    return "hello"

if __name__ == '__main__':
    find_townhalls('', '')
