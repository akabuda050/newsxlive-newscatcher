# Newsxlive - Newscatcher
Bridge between Newscatcher API and Ghost.

# Fetch news and post it into Ghost site.
- To run this go to Ghost admin panel, add custom integration, get `GHOST ADMIN API KEY` and `GHOST API URL` and set it to .env file.
- Set your Ghost authors emails variable like `GHOST_AUTHORS="author1@example.com;author2@example.com"` in .env file.

# RapidAPI and Newscatcher
- Register account on RapidAPI (https://rapidapi.com/) and subscribe to Newscatcher.
- Make your application in order to get API key and set it to your `X_RAPID_API_KEY` in .env file.

# Mail
- Application supports Mailgun (https://www.mailgun.com/).
- You can find your API key here https://app.mailgun.com/app/sending/domains/{YOUR_DOMAIN}/sending-keys
- Set `SEND_EMAILS` to true

# Misc
If you want to fetch old news too you can set `TODAY_ONLY` to true
