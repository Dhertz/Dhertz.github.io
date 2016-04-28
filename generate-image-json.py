#!/usr/bin/env python

import json
import requests
import sys

insta_self_recent = 'https://api.instagram.com/v1/users/self/media/recent/'

def main():
  if len(sys.argv) != 2:
    sys.exit("Please provide the instagram secret for " +
      "the account you wish to use")

  intsagram_secret = sys.argv[1]
  images = get_my_media(intsagram_secret)
  all_images = add_images(intsagram_secret, images, [])
  print all_images

def add_images(intsagram_secret, images, existing_images):
  ''' Haskell-inspired function that recurses over the list of images,
    finding the first image that we already have in our repo, then adding
    the rest in reverse order. Also works when we start from scratch.
  '''

  if len(images) == 0:
    return []

  if images[0]['id'] not in [image['id'] for image in existing_images]:
    if len(images) == 1:
      images += get_my_media(intsagram_secret, images[0]['id'])
    existing_images = add_images(intsagram_secret, images[1:], existing_images)
    existing_images += images
  return existing_images

def get_my_media(secret, max_id=""):
  # Instagram paginates it's media, so we might have to make multiple requests
  req = requests.get(insta_self_recent, params={'access_token':secret, 'max_id':max_id})
  if req.status_code == 200 and req.json()['meta']['code'] == 200:
    resp = req.json()
    images = [{
                'link':m['link'],
                'image':m['images']['standard_resolution']['url'],
                'id':m['id']
              }
      for m in resp['data']]
    print req.url
    return images
  else:
    print("Instagram API request failed!")
    req.raise_for_status()

if __name__ == '__main__':
  main()