#!/usr/bin/env python

from collections import namedtuple
import requests
import sys

def main():
	if len(sys.argv) != 2:
		sys.exit("Please provide the instagram secret for " +
			"the account you wish to use")

	intsagram_secret = sys.argv[1]
	get_my_media(intsagram_secret)

def get_my_media(secret, max_id=""):
	# Instagram paginates it's media, so we might have to make multiple requests
	req = requests.get('https://api.instagram.com/v1/users/self/media/recent/',
		params={'access_token':secret, 'max_id':max_id})
	if req.status_code == 200 and req.json()['meta']['code'] == 200:
		Media = namedtuple('Media', 'link image id')
		images = [Media(m['link'], m['images']['standard_resolution']['url'], m['id']) for m in req.json()['data']]
		print images
	else:
		print("Instagram API request failed!")
		req.raise_for_status()

if __name__ == '__main__':
	main()


