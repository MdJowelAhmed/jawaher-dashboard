export function getRouteMeta(pathname) {
  const rules = [
    { test: /^\/dashboard\/?$/, title: 'Dashboard', breadcrumbs: [{ label: 'Overview' }, { label: 'Dashboard' }] },
    { test: /^\/users\/[^/]+$/, title: 'User details', breadcrumbs: [{ label: 'Users', to: '/users' }, { label: 'Profile' }] },
    { test: /^\/users\/?$/, title: 'Users', breadcrumbs: [{ label: 'Management' }, { label: 'Users' }] },
    { test: /^\/trivia\/create\/?$/, title: 'Add Trivia Question', breadcrumbs: [{ label: 'Trivia', to: '/trivia' }, { label: 'Create' }] },
    { test: /^\/trivia\/[^/]+\/edit\/?$/, title: 'Edit question', breadcrumbs: [{ label: 'Trivia', to: '/trivia' }, { label: 'Edit' }] },
    { test: /^\/trivia\/?$/, title: 'Trivia', breadcrumbs: [{ label: 'Management' }, { label: 'Trivia' }] },
    { test: /^\/categories\/?$/, title: 'Categories', breadcrumbs: [{ label: 'Management' }, { label: 'Categories' }] },
    { test: /^\/games\/[^/]+$/, title: 'Game details', breadcrumbs: [{ label: 'Games', to: '/games' }, { label: 'Details' }] },
    { test: /^\/games\/?$/, title: 'Games', breadcrumbs: [{ label: 'Management' }, { label: 'Games' }] },
    { test: /^\/notifications\/?$/, title: 'Notifications', breadcrumbs: [{ label: 'System' }, { label: 'Notifications' }] },
    { test: /^\/reports\/?$/, title: 'Reports', breadcrumbs: [{ label: 'System' }, { label: 'Reports' }] },
    { test: /^\/settings\/?$/, title: 'Settings', breadcrumbs: [{ label: 'System' }, { label: 'Settings' }] },
  ]
  return rules.find((rule) => rule.test.test(pathname)) || { title: 'Freej Trivia', breadcrumbs: [{ label: 'Admin' }] }
}
