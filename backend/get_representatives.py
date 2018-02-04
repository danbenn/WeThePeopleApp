"""Get representatives for a given address, matched with facebook ids."""

from multiprocessing.dummy import Pool as ThreadPool
import json
import re
from pprint import pprint
import nameparser
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from utils import request_until_succeed

CRED = credentials.Certificate('serviceKey.json')
firebase_admin.initialize_app(CRED, {
    'databaseURL': 'https://wethepeople-cb4d1.firebaseio.com'
})
DB = db.reference()
API_KEYS = json.load(open('apiKeys.json'))


def get_representatives(voter_address):
    """Get representatives for given address."""
    # Check cache before requesting representatives
    user_node = DB.child('users/{0}'.format(voter_address)).get()
    if user_node and 'reps' in user_node:
        return user_node['reps']
    response = get_civic_api_response(voter_address)
    if 'officials' not in response:
        return None
    reps = response['officials']
    offices = response['offices']
    reps = match_reps_with_offices(reps, offices)
    for rep in reps:
        rep['name'] = get_first_and_last_name(rep['name'])
    pool = ThreadPool(4)
    reps = pool.map(match_rep_with_facebook_id, reps)
    # Cache representatives for future use
    user_node = DB.child('users/{0}'.format(voter_address)).set({
        'reps': reps,
    })
    return reps


def get_civic_api_response(voter_address):
    """Query Google Civic API for list of representatives."""
    base_url = 'https://www.googleapis.com/civicinfo/v2/representatives'
    voter_address = voter_address.replace(' ', '%20')
    api_key = '?key=AIzaSyCaelyPik0uSyDxNy86JwVaJhwS2YDjXVg'
    full_url = base_url + api_key + '&address=' + voter_address
    response = requests.get(full_url).json()
    return response


def match_reps_with_offices(reps, offices):
    """Find official title for each rep; e.g., 'Senator'."""
    for office in offices:
        for index in office['officialIndices']:
            position = get_rep_title_for_display(office['name'])
            reps[index]['position'] = position
    return reps


def match_rep_with_facebook_id(person):
    """Use either hand-tagged Facebook page or try and auto find it."""
    if 'channels' in person:
        for channel in person['channels']:
            if channel['type'] == 'Facebook':
                official_fb_id = channel['id']
                # Some of these IDs are outdated. need to make sure
                # the page is still valid by making dummy request
                if page_is_valid(official_fb_id):
                    person['facebook_id'] = official_fb_id
    if 'facebook_id' not in person:
        name = person['name']
        position = person['position']
        person['facebook_id'] = get_facebook_id(name, position)
    return person


def page_is_valid(page_id):
    """Request posts from page to check if it still exists."""
    access_token = API_KEYS['fb_access_token']
    base = 'https://graph.facebook.com/v2.9'
    node = '/{}/posts'.format(page_id)
    parameters = '/?limit={}&access_token={}'.format(1, access_token)
    base_url = base + node + parameters
    response = requests.get(base_url).json()
    if 'error' in response:
        return False
    return True


def get_facebook_id(name, position):
    """Get reps facebook ids by searching Facebook."""
    # Check cache before searching Facebook
    parsed_name = nameparser.HumanName(name)
    first_and_last = parsed_name.first + ' ' + parsed_name.last
    # Remove nonalphameric characters to avoid database query errors
    sanitized_name = re.sub(r'\W+', '', first_and_last)
    rep_node = DB.child('reps/{0}'.format(sanitized_name)).get()
    if rep_node and 'facebook_id' in rep_node:
        return rep_node['facebook_id']
    shortened_position = get_rep_title_for_search(position)
    # Try searching using their name AND title
    name_and_title = shortened_position + ' ' + first_and_last
    pages = get_politician_pages(name_and_title)
    if not pages:
        # Try a broader search using only their name
        pages = get_politician_pages(first_and_last)
        if not pages:
            return None
    return pages[0]['id']


def get_politician_pages(query):
    """Get search results for politician pages."""
    base = 'https://graph.facebook.com/v2.9'
    node = '/search?q=' + query.replace(' ', '%20')
    parameters = '&type=page&fields=name,category'
    access_token = '&access_token={}'.format(API_KEYS['fb_access_token'])
    url = base + node + parameters + access_token
    pages = json.loads(request_until_succeed(url))['data']
    politician_pages = [page for page in pages
                        if page['category'] == 'Politician']
    return politician_pages


def get_first_and_last_name(name):
    """Remove middle name and titles."""
    parsed_name = nameparser.HumanName(name)
    return parsed_name.first + ' ' + parsed_name.last


def get_rep_title_for_search(title):
    """
    Shorten the position name of a representative, specifically for looking up
    their page using Graph search.
    """
    title = title.split(' of ')[0]
    return title


def get_rep_title_for_display(title):
    """
    Adjust the title of rep for display purposes.

    It's usually made shorter.
    """
    return title.replace(' of the United States', '')\
        .replace('Senate', 'Senator').replace('United States', 'U.S.')\
        .replace('Representatives', 'Reps')


if __name__ == '__main__':
    pprint(get_representatives('6578 riverdale dr'))
