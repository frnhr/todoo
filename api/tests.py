from base64 import b64encode
from django.test import TestCase
from django.contrib.auth.models import User
from core.models import Item
from django.test.client import Client, MULTIPART_CONTENT


USERS = [
    {
        'username': 'admin',
        'password': '25652565',
        'is_staff': True,
        'is_superuser': True,
    },
    {
        'username': 'user2',
        'password': '25652565',
        'is_staff': False,
        'is_superuser': False,
    },
]

ITEMS = [
    {
        'priority': 10,
        'due_date': "2013-12-11",
        'memo': 'Memo text\nwith line\nbreaks',
    }
]


#
# By default, the test client will disable any CSRF checks performed by your site.
#


class SimpleTests(TestCase):

    def setUp(self):
        for user_data in USERS:
            user = User(**user_data)
            user.set_password(user_data['password'])
            user.save()

    def _get_auth_header(self, user):
        userAndPass = b64encode(user['username'] + ':' + user['password']).decode("ascii")
        return {'HTTP_AUTHORIZATION': 'Basic %s' % userAndPass}

    def test_post_anonymous(self):
        c = Client()
        response = c.post('/api/items/', ITEMS[0])
        self.assertEqual(response.status_code, 403)
        self.assertIn('Authentication credentials were not provided.', str(response))

    def test_post_admin(self):
        headers = {}
        headers.update(self._get_auth_header(USERS[0]))
        c = Client()

        response = c.post('/api/items/', data=ITEMS[0], content_type=MULTIPART_CONTENT, follow=False, **headers)
        self.assertEqual(response.status_code, 201)
        self.assertNotIn('Authentication credentials were not provided.', str(response))
        self.assertIn('/api/items/1/', str(response))
        self.assertIn('/api/users/1/', str(response))
        self.assertIn(ITEMS[0]['memo'].split('\n')[1], str(response))

    def test_get_admin(self):
        headers = {}
        headers.update(self._get_auth_header(USERS[0]))
        c = Client()

        response = c.get('/api/items/', data={}, follow=False, **headers)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('Authentication credentials were not provided.', str(response))



