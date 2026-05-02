import urllib.request
import urllib.error
import json
import time

posts_data = [
    {
        "title": "Handling immediate physical threats offline",
        "description": "The AI tells me to call 911 when I feel physically followed, but my local police department has a 30-minute average response time and I am currently walking in an unfamiliar suburban area. What are practical offline strategies to de-escalate or lose an active stalker when authorities are far away?",
        "tags": ["PersonalSafety", "Stalker", "Urgent"],
        "author": "Sarah Jenkins",
        "avatar": "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random"
    },
    {
        "title": "Reporting domestic disturbances anonymously",
        "description": "I tried asking the chatbot how to handle my neighbor's violent domestic dispute next door, but the AI gives very generic advice about contacting local authorities. Given I don't want the abuser to realize I'm the one who called the cops, what's a safe way to intervene or report without becoming a target myself?",
        "tags": ["CommunityWatch", "Anonymity"],
        "author": "Anonymous Neighbor",
        "avatar": "https://ui-avatars.com/api/?name=Anonymous+Neighbor&background=random"
    },
    {
        "title": "Unknown plant ingestion off-grid",
        "description": "My friend accidentally ingested an unknown plant while hiking in the Appalachians. The AI chatbot refuses to identify the plant or give medical advice due to safety guardrails. We are 3 hours from a hospital. Does anyone have a reliable contact for local botanical poison control?",
        "tags": ["Wilderness", "FirstAid", "Emergency"],
        "author": "Hiker John",
        "avatar": "https://ui-avatars.com/api/?name=Hiker+John&background=random"
    }
]

replies_data = {
    0: [
        {
            "author": "Officer Mike (Ret.)",
            "content": "If you are in a suburban area and being followed, never go straight home. Walk with purpose towards the nearest brightly lit commercial area (gas station, convenience store). Once inside, notify the cashier and stay in full view of cameras. If absolutely isolated, knocking vigorously on a random residential door yelling 'Fire!' draws more attention than 'Help!'.",
            "avatar": "https://ui-avatars.com/api/?name=Officer+Mike&background=random"
        }
    ],
    1: [
        {
            "author": "Crisis Counselor Jane",
            "content": "You are absolutely right to avoid direct intervention. The safest route is to call 911 and explicitly request to remain anonymous. You can refuse to give your name. Another tactic is to create a random distraction, like loudly setting off your car alarm from inside your house. This often interrupts the escalation temporarily.",
            "avatar": "https://ui-avatars.com/api/?name=Crisis+Counselor&background=random"
        }
    ],
    2: [
        {
            "author": "Rescue Medic Dan",
            "content": "Do not wait for a plant ID online. Call the National Poison Control Center immediately at 1-800-222-1222. In the meantime, save a piece of the plant in a bag so medical professionals can identify it when you reach the ER. Do not induce vomiting unless explicitly directed by Poison Control.",
            "avatar": "https://ui-avatars.com/api/?name=Medic+Dan&background=random"
        }
    ]
}

def post_json(url, payload):
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error {e.code} on {url}: {e.read().decode()}")
        return None

base_url = "http://127.0.0.1:8000/api/v1/community/posts"

for i, post in enumerate(posts_data):
    print(f"Creating post {i+1}...")
    created = post_json(base_url, post)
    if created and "_id" in created:
        post_id = created["_id"]
        print(f"Created successfully: {post_id}")
        
        if i in replies_data:
            for reply in replies_data[i]:
                reply_url = f"{base_url}/{post_id}/reply"
                print(f"  Adding reply to {post_id}...")
                post_json(reply_url, reply)
                time.sleep(0.5)
    time.sleep(1)

print("Seeding complete!")
