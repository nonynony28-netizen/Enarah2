# file name: app.py

import os
from groq import Groq

# تأكد أنك ضفت المتغير في النظام:
# Windows (PowerShell):
# setx GROQ_API_KEY "your_api_key_here"
#
# Linux / Mac:
# export GROQ_API_KEY="your_api_key_here"

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Hello, how are you?"
        }
    ],
    model="llama-3.3-70b-versatile"
)

print(chat_completion.choices[0].message.content)
