#!/usr/bin/env python

import requests
import sys


def main():
	if len(sys.argv) != 2:
		sys.exit("Please provide the instagram secret for " +
			"the account you wish to use")

	intsagram_secret = sys.argv[1]
	req = requests.get('https://api.instagram.com/v1/users/self/media/recent/',
		params={'access_token':intsagram_secret})
	if req.status_code == 200:
		print req.json()
	else:
		req.raise_for_status()

if __name__ == '__main__':
	main()


