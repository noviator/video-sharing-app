// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { uuid } from 'uuidv4';
import { client } from '../../utils/client';


// api request to like and unlike a post
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method == 'PUT'){
    const { userId, postId, like } = req.body;

    // change something in client => patch
    const data = like ? await client
        .patch(postId)
        .setIfMissing({likes: []}) //happens if the post doesn't have any likes | sets likes to an empty array
        .insert('after','likes[-1]',[ // insert a new object after the end of like array
            {
                _key: uuid(),
                _ref:userId
            }
        ]).commit() // save it.
        : await client
        .patch(postId)
        .unset([`likes[_ref=="${userId}"]`]) // checks all the likes and finds the like inside likes array that has _ref = userId and deletes it
        .commit(); // save it.

        res.status(200).json(data);
  }
}
