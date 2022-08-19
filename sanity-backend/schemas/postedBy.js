export default{
    name: 'postedBy',
    title: 'Posted By',
    type: 'reference', // connect 2 different documents
    to: [{type: 'user'}] // reference to user document (one user can have multiple comments, we keep track of the comment's by the user)
} 