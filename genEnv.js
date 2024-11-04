import * as fs from 'fs'

const donationTracker = JSON.parse(fs.readFileSync('./demo/donationTracker.json').toString())
const fundraisers = JSON.parse(fs.readFileSync('./demo/fundraisers.json').toString())
const overlayConfig = JSON.parse(fs.readFileSync('./demo/overlayConfig.json').toString())
const panelConfig = JSON.parse(fs.readFileSync('./demo/panelConfig.json').toString())
const schedule = JSON.parse(fs.readFileSync('./demo/schedule.json').toString())

// write .env.dev file
fs.writeFileSync(
    './.env.dev',
    `PUBLIC_DEMO_SCHEDULE='${JSON.stringify(schedule).replaceAll("'","")}'\n
PUBLIC_DEMO_DONATION_TRACKER='${JSON.stringify(donationTracker).replaceAll("'","")}'\n
PUBLIC_DEMO_FUNDRAISERS='${JSON.stringify(fundraisers).replaceAll("'","")}'\n
PUBLIC_DEMO_OVERLAY_CONFIG='${JSON.stringify(overlayConfig).replaceAll("'","")}'\n
PUBLIC_DEMO_PANEL_CONFIG='${JSON.stringify(panelConfig).replaceAll("'","")}'`
)
