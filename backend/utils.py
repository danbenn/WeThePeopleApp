try:
    from urllib.request import urlopen, Request
except ImportError:
    from urllib2 import urlopen, Request

def request_until_succeed(url):
    """Overcome Facebook API rate limitations by retrying queries."""
    req = Request(url)
    success = False
    while success is False:
        try:
            response = urlopen(req)
            if response.getcode() == 200:
                success = True
        except Exception as e:
            print(e)
            time.sleep(5)

            print("Error for URL {}: {}".format(url, datetime.now()))
            print("Retrying.")

    return response.read()