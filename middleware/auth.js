export default function(context) {
  console.log('Middleware');
  if (!context.store.getters.isAuthenticated) {
    context.redirect('/admin/auth');
  }
}
