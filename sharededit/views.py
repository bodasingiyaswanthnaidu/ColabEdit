from django.http.response import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from chat.views import is_room_occupied
from .models import ChatUser, ChatRoom, UserAndRoom
import requests
from django.views.decorators.csrf import csrf_exempt
import json
import time
import urllib.request


# RUN_URL = u'https://api.hackerearth.com/v3/code/run/'
# CLIENT_SECRET = os.environ['CLIENT_SECRET']

# RUN_URL = u'https://api.jdoodle.com/v1/execute'
# clientId = '10f457853c65c0ae454df52b5fc49e25'
# clientSecret = '3f68357e52985da49a1da4511a229b994613b9955d7e6e685063ecd37a3c5934'

RUN_URL = u'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/'
HACKERRANK_ID = '3a8e884a274fd3d4cb9bb575b32c7094dffb6e0eeb26.api.hackerearth.com'
CLIENT_SECRET = '6a7d60d7103e379606d5c9f68c14b7a2f829d146'


@login_required
def shared_editing(request, room_name):
    # print(room_name, 'was visited')
    if not is_room_occupied(room_name):  # if not occupied, ask to set a password
        return render(request, 'shared.html', {
            'room_name': room_name,
            'set_pass': True,
        })
    else:  # else ask user to enter the password
        chat_user = ChatUser.objects.get(chat_user=request.user)
        # print(chat_user)
        chat_rooms = UserAndRoom.objects.filter(chat_user=chat_user)
        # print(chat_rooms)
        for room in chat_rooms:
            if str(room.chat_room) == room_name:
                # user is already authorized
                return render(request, 'shared.html', {
                    'room_name': room_name,
                    'user': request.user
                })
        # user is not authorized, ask for password
        return render(request, 'shared.html', {
            'room_name': room_name,
            'get_pass': True,
        })


@csrf_exempt
def run_code(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        code = body['code']
        # TODO (this is very unsafe way of executing untrusted scripts)
        headers = {"client-secret": CLIENT_SECRET}
        data = {
            'async': 0,
            'source': code,
            'lang': "PYTHON3",
            'time_limit': 5,
            'memory_limit': 262144,
            'id': HACKERRANK_ID,
        }
        r = requests.post(RUN_URL, data=data, headers=headers)
        # print("r json: ",r.json())
        dic = get_status(r.json()['status_update_url'])
        # print(dic)
        status = dic['request_status']['code']
        while status != "REQUEST_COMPLETED":
            dic = get_status(r.json()['status_update_url'])
            status = dic['request_status']['code']
            time.sleep(1.5)
        print("result\n\n\n\n", dic)
        open_url=dic['result']['run_status']['output']
        fp = urllib.request.urlopen(open_url)
        mybytes = fp.read()
        mystr = mybytes.decode("utf8")
        fp.close()
        print(mystr)
        return JsonResponse({"code": 0, "msg": "Successfully ran code", "results": mystr}, status=200)


@csrf_exempt
def get_status(GET_STATUS_URL):
    headers = {"client-secret": CLIENT_SECRET}
    resp = requests.get(GET_STATUS_URL, headers=headers)
    dict = json.loads(resp.text)
    return dict

