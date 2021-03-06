"""Adapted from https://github.com/minimaxir/facebook-page-post-scraper ."""

import json
from datetime import datetime, timedelta
import time
from pprint import pprint
from multiprocessing.dummy import Pool as ThreadPool
try:
    from urllib.request import urlopen, Request
except ImportError:
    from urllib2 import urlopen, Request
import nameparser
from get_representatives import get_representatives
from utils import request_until_succeed
API_KEYS = json.load(open('apiKeys.json'))

# Midnight of this current day: https://stackoverflow.com/a/19718517
BEGINNING_OF_TODAY = datetime(*datetime.now().timetuple()[:3])
# Get dates in YYYY-MM-DD format
SINCE_DATE = str(BEGINNING_OF_TODAY - timedelta(days=1))[0:10]
UNTIL_DATE = str(BEGINNING_OF_TODAY - timedelta(days=0))[0:10]


def get_recent_posts(address):
    """Get most liked recent post (past 24 hrs) from each representative."""
    start = time.time()
    reps = get_representatives(address)
    reps_with_facebook = [rep for rep in reps if 'facebook_id' in rep
                          and rep['facebook_id']]
    # Remove duplicate Facebook IDs
    seen = set()
    reps_with_facebook = [seen.add(obj['facebook_id']) or obj for obj in
                          reps_with_facebook if obj['facebook_id'] not in seen]
    pool = ThreadPool(4)
    posts = pool.map(scrape_facebook_page_status, reps_with_facebook)
    posts = [post for post in posts if post]
    posts.sort(key=lambda x: x['reactions'], reverse=True)
    end = time.time()
    # print(end - start)
    return posts


def scrape_facebook_page_status(rep):
    """
    Get statuses from Facebook page.

    Input date should be formatted as: YYYY-MM-DD
    """
    parsed_name = nameparser.HumanName(rep['name'])
    first_and_last = parsed_name.first + ' ' + parsed_name.last
    page_id = rep['facebook_id']
    access_token = API_KEYS['fb_access_token']
    base = 'https://graph.facebook.com/v2.9'
    node = '/{}/posts'.format(page_id)
    parameters = '/?limit={}&access_token={}'.format(100, access_token)
    # Get unix timestamps
    since_unix = get_unix_timestamp(SINCE_DATE)
    until_unix = get_unix_timestamp(UNTIL_DATE)
    since = '&since={}'.format(since_unix) if since_unix \
        is not '' else ''
    until = '&until={}'.format(until_unix) if until_unix \
        is not '' else ''

    base_url = base + node + parameters + since + until
    url = get_facebook_page_feed_url(base_url)
    statuses = json.loads(request_until_succeed(url))

    statuses = [status for status in statuses['data'] if 'reactions' in status]
    statuses = list(map(process_facebook_status, statuses))
    # Find status with the most reactions
    statuses.sort(key=lambda x: x['reactions'], reverse=True)
    if statuses:
        top_status = statuses[0]
        top_status['author'] = first_and_last
        top_status['page_id'] = page_id
        top_status['title'] = rep['position']
        top_status['party'] = rep['party']
        top_status['type'] = 'post'
        if top_status['picture_url'] == '':
            # Use page's cover photo for posts with no picture
            url = base + \
                '/{}?fields=cover&access_token={}'.format(page_id, access_token)

            # try:
            response = json.loads(request_until_succeed(url))
            cover_url = response['cover']['source']
            top_status['picture_url'] = cover_url
            '''
            except KeyError:
                print('Error: unable to recover cover photo for: ' + page_id)
                print(response)
                top_status['picture_url'] = 'https://www.cdc.gov/quarantine/stations/images/washington-dc_600px.jpg'
                raise
            '''
        return top_status
    else:
        return None


def get_unix_timestamp(date_str):
    """Convert YYYY-MM-DD to unix timestamp."""
    return time.mktime(datetime.strptime(date_str, "%Y-%m-%d").timetuple())


def unicode_decode(text):
    """Need to write tricky unicode correctly to csv."""
    try:
        return text.encode('utf-8').decode()
    except UnicodeDecodeError:
        return text.encode('utf-8')


def get_facebook_page_feed_url(base_url):
    """
    Construct the URL string.

    see http://stackoverflow.com/a/37239851 for Reactions parameters.
    """
    fields = "&fields=message,full_picture,link,created_time,type,name,id," + \
        "permalink_url,comments.limit(0).summary(true),shares,reactions" + \
        ".limit(0).summary(true)"

    return base_url + fields


def process_facebook_status(status):
    """
    Status is now a Python dict, so for top-level items, we can call the key.

    Additionally, some items may not always exist,
    so must check for existence first.
    """
    new_status = {}

    new_status['status_id'] = status['id']
    new_status['permalink_url'] = status['permalink_url']
    new_status['status_type'] = status['type']
    new_status['status_message'] = '' if 'message' not in status else \
        unicode_decode(status['message'])
    new_status['link_name'] = '' if 'name' not in status else \
        unicode_decode(status['name'])

    new_status['picture_url'] = '' if 'full_picture' not in status else \
        unicode_decode(status['full_picture'])
    new_status['external_link'] = ''
    if 'link' in status and 'facebook.com' not in status['link']:
        new_status['external_link'] = unicode_decode(status['link'])

    # Time needs special care since a) it's in UTC and
    # b) it's not easy to use in statistical programs.
    status_published = datetime.strptime(
        status['created_time'], '%Y-%m-%dT%H:%M:%S+0000')
    status_published = status_published + \
        timedelta(hours=-5)  # EST
    status_published = status_published.strftime(
        '%Y-%m-%d %H:%M:%S')  # best time format for spreadsheet programs
    new_status['published_date'] = status_published

    # Nested items require chaining dictionary keys.
    new_status['reactions'] = 0 if 'reactions' not in status else \
        status['reactions']['summary']['total_count']

    return new_status


if __name__ == '__main__':
    posts = get_recent_posts('1341 geddes ave')
    dates = [post['published_date'] for post in posts if 'published_date' in post]
    # pprint(posts)
    # with open('samplePosts.json', 'w') as outfile:
    #     json.dump(posts, outfile, indent=4)
