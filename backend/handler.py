"""Handle serverless integration with project code."""
import json
from get_posts import get_recent_posts
from get_events import get_events


def find_recent_posts(event, context):
    """Entry point for the /find_recent_posts url."""
    if 'pathParameters' in event and 'address' in event['pathParameters']:
        address = event['pathParameters']['address']
        posts = get_recent_posts(address)
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(posts)
        }
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({})
    }


def find_upcoming_events(event, context):
    """Entry point for the /find_upcoming_events url."""
    if 'pathParameters' in event and 'address' in event['pathParameters']:
        address = event['pathParameters']['address']
        events = get_events(address)
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(events)
        }
    return {
        'statusCode': 404,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({})
    }
