"""Get officially posted events, along with mentions of events in statuses."""

import json
from datetime import datetime
import facebook


API_KEYS = json.load(open('apiKeys.json'))
graph = facebook.GraphAPI(access_token=API_KEYS['fb_access_token'])

def get_official_events(facebook_id):
    """Get official Facebook events posted on a Facebook page."""
    try:
        fields = 'fields=cover,description,end_time,start_time,place,name'
        url = facebook_id + '/events?time_filter=upcoming&' + fields
        fb_event = graph.request(url)['data']
        return fb_event
    except (KeyError, facebook.GraphAPIError):
        return None
