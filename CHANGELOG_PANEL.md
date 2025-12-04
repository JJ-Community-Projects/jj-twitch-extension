3.0.1 - Submition 1 (2025-12-04)

General Info:
The Jingle Jam is a yearly charity event hosted by the Jingle Jam Charity. https://www.jinglejam.co.uk/

Depending on the channel, there are 4 tabs shown.
- User Schedule
- Yogs Schedule
- Charity (always shown)
- Fundraisers (always shown)

The test channel shows all tabs for testing purposes.

Bug fixes
- Updated the live indicator on schedules (User and Yogs)
  - Streams now show correctly if they are currently live
- Added "Last fetched" label below yogs schedule (scroll)
- Update refetch intervals for schedules
- Update "Previous" and "Website" labels on the yogs schedule controls
  - "Previous" is now "Before"
  - "Website" is now "Web"

---

- 3.0.0 - Submition 2 (2025-11-15)
Fixed issues mentioned in the Review
- The User Schedule loads, this was a backend issue.
- As per 4.6.3 - Remove all Tiltify links and links to the charities websites. The extension now only links to participating Twitch channels.

General Info:
The Jingle Jam is a yearly charity event hosted by the Jingle Jam Charity. https://www.jinglejam.co.uk/

Depending on the channel, there are 4 tabs shown.
- User Schedule
- Yogs Schedule
- Charity (always shown)
- Fundraisers (always shown)

The test channel shows all tabs for testing purposes.
The test channel shows demo schedules and charities and fundraisers form 2024.

User Schedule:
- Shows the user's schedule if they have configured one at https://jj.ostof.dev
- Users can click on streams to get more information, like links to participants' twitch channels

Yogs Schedule:
- Shows the current JJ schedule for the Yogscast Twitch channel
- Users can click on streams to get more information, like links to participants' twitch channels

Charity:
- Shows the current charity that the Jingle Jam is supporting
- Shows overview of the Jingle Jam

Fundraisers:
- Shows a list of JJ community fundraisers
- Shows overview of the Jingle Jam
- Link to the fundraiser/streamer Twitch page

---

3.0.0 - Submition 1 (2025-11-10) with issues
General Info:
The Jingle Jam is a yearly charity event hosted by the Jingle Jam Charity.

Depending on the channel, there are 4 tabs shown.
- User Schedule
- Yogs Schedule
- Charity (always shown)
- Fundraisers (always shown)

The test channel shows all tabs for testing purposes.
The test channel shows demo schedules and charities and fundraisers form 2024.

User Schedule:
- Shows the user's schedule if they have configured one at https://jj.ostof.dev
- Users can click on streams to get more information, like links to participants twitch channels

Yogs Schedule:
- Shows the current JJ schedule for the Yogscast Twitch channel
- Users can click on streams to get more information, like links to participants twitch channels

Charity:
- Shows the current charity that the Jingle Jam is supporting
- Shows overview of the Jingle Jam
- Link to the charity website and tiltify donation page

Fundraisers:
- Shows a list of JJ community fundraisers
- Shows overview of the Jingle Jam
- Link to the fundraiser Twitch page and tiltify donation page

Changelog:
- Update to new backend endpoints
- Removed most user configurations
  - users can only change the theme
  - the backend decides the tabs that are shown
- Updated Config page
  - Added instructions on how to join the Jingle Jam Fundraising
  - Added instructions on how to connect the users Twitch and Tiltify accounts
  - Added instructions on how to create a custom schedule
  - Added a Jingle Jam countdown
- Added custom Header with campaign info
  - Only shown if the twitch channel can be associated with a campaign 
  - donation link
  - campaign and charity names
  - amounts raised
- Updated Jingle Jam Overview Info
  - Now it is collapsible
  - Currency switch is persistent
- New User Schedule Tab
  - Users can optionally sign up on https://jj.ostof.dev and create their custom jj schedule
  - The User schedule tab is only shown if the user has a schedule
- Yogs Schedule Tab
  - Updated visuals
  - This Tab is only shown on the Yogscast channel and members of the Yogscast Stream Team
    - It is the first tab on the Yogscast channel
    - It is the last tab on the Yogscast Stream Team members channels
- Fundraisers Tab
  - Updated visuals
  - Add JJ collapsible Overview Info
- Charity Tab
  - Updated visuals
  - Add JJ collapsible Overview Info

---

2.0.2
- Update data loading, previously donation and charity data was loaded even if the tabs were not visible
- Update Community Fundraiser links, now they link to either the twitch channel or tilitfy page
- Update About link color
- Update stream dialog text color
- Small bug fixes

---

2.0.1
- Added Link to the Jingle Jam Stream Team in the Community Tab
- Update Donation and About Buttons in the header
- Update About popup with more information
- Add images for creators in the stream dialog (click on a stream)
- Small bug fixes

---

Review Feedback 24.10.2024, 22:03 CET
Added Privacy Policy: https://jj.ostof.dev/twitch-extension/privacy

2.0.0
- Last year was supposed to be 1.0.0, but I set the wrong version number...
- Updated Backend endpoints
- Add new topbar with separate About and donate buttons
- Simplify schedule stream dialog.

About:
The panel consists of 3 tabs.
The Tabs order and visibility can be configured by the streamer.
The tabs are:
- Yogs Schedule, which shows the current JJ schedule for the Yogscast Twitch channel.
- Charities, which shows the current charity that the Jingle Jam is supporting.
- Community, which shows a list of JJ community fundraisers.

Users can click on streams to get more information 
and charities to visit their websites.
Users can also click on community fundraisers to visit their Twitch pages.

For demo purposes, so of the data is from last year.
