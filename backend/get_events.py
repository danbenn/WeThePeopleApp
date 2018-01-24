"""Get officially posted events, along with mentions of events in statuses."""

import json
from datetime import datetime
from get_posts import request_until_succeed

API_KEYS = json.load(open('apiKeys.json'))


def get_official_events(page_id):
    """Get official Facebook events posted on a Facebook page."""
    access_token = API_KEYS['fb_access_token']
    base = 'https://graph.facebook.com/v2.9'
    node = '/{}/events'.format(page_id)
    parameters = '/?limit={}&access_token={}'.format(100, access_token)
    fields = '&fields=cover,description,end_time,start_time,place,name'
    time_filter = '&time_filter=upcoming'
    url = base + node + parameters + fields  # + time_filter
    events = json.loads(request_until_succeed(url))['data']
    return events


if __name__ == '__main__':
    print(get_official_events('adamfzemke'))