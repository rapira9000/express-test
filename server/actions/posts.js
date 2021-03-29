module.exports = ({posts}) => ({
   getAll: () => {
       return posts.Instance.find();
   },

   insert: (payload) => {
       const p = new posts.Instance({
           name: payload.name,
           content: payload.content
       });
       return p.save();
   }
});