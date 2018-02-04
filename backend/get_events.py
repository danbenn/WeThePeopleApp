"""Get officially posted events, along with mentions of events in statuses."""

import json
from pprint import pprint
from get_posts import request_until_succeed
from get_representatives import get_representatives

API_KEYS = json.load(open('apiKeys.json'))


def get_events(voter_address):
    """Get events from all representatives of voter at voter_address."""
    reps = get_representatives(voter_address)
    all_events = []
    for rep in reps:
        if 'facebook_id' in rep and rep['facebook_id']:
            party = rep['party'] if ('party' in rep) else ''
            events = get_events_for_page(page_id=rep['facebook_id'],
                                         author=rep['name'],
                                         title=rep['position'],
                                         party=party)
            all_events += events
    return all_events


def get_events_for_page(page_id, author, title, party):
    """Get official Facebook events posted on a Facebook page."""
    access_token = API_KEYS['fb_access_token']
    base = 'https://graph.facebook.com/v2.9'
    node = '/{}/events'.format(page_id)
    parameters = '/?limit={}&access_token={}'.format(100, access_token)
    fields = '&fields=cover,description,end_time,start_time,place,name'
    time_filter = '&time_filter=upcoming'
    url = base + node + parameters + fields + time_filter
    events = json.loads(request_until_succeed(url))['data']
    for event in events:
        event['page_id'] = page_id
        event['type'] = 'event'
        event['author'] = author
        event['title'] = title
        event['party'] = party
    return events


if __name__ == '__main__':
    data = get_events('seattle, wa')
    pprint(data)
    # with open('sampleEvents.json', 'w') as outfile:
    #     json.dump(data, outfile, indent=4, sort_keys=True)
