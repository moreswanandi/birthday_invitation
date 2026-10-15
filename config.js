/* =====================================================================
   config.js  —  THE ONLY FILE YOU NEED TO EDIT FOR THE DETAILS
   ---------------------------------------------------------------------
   Rules (very simple):
   1. Change only the text between the "quotes".  Keep the quotes and commas.
   2. Anything you leave as "" (empty) is hidden from the invitation.
   3. Anything still inside [square brackets] is a placeholder. While a
      placeholder is present, the page shows a "PREVIEW MODE" bar so you
      can't accidentally share an unfinished invitation.
   ===================================================================== */

var birthdayConfig = {

  /* ---------- WHO & WHAT ---------- */
  celebrantName: "Mahesh Manohar More",          // shown big on the reveal screen
  age: "50",                              // the big number (keep it as text)
  occasion: "50th Birthday Celebration",  // small line under the name
  hostName: "More Family",         // "With love, ..."  ("" to hide)

  /* ---------- WHEN ----------
     eventDate  : YYYY-MM-DD   (year-month-day, always this order)
     startTime  : HH:MM        (24-hour clock, 19:00 = 7 PM). "" = no time shown
     utcOffset  : the time zone of the PARTY. India = "+05:30"
     durationHours : how long the party lasts (used for calendar entries)   */
  eventDate: "2026-10-28",                // <-- CHANGE THIS to the real date
  startTime: "18:00",
  utcOffset: "+05:30",
  durationHours: 4,

  /* ---------- WHERE ---------- */
  venueName: "Sheth Midori",
  venueAddress: "Sheth Midori Hall, Hanuman Tekdi, Ashokvan, Dahisar(East),Mumbai-400066",
  mapsLink: "",     // optional: paste a Google Maps share link.
                    // If empty, a link is made automatically from the address.

  /* ---------- EXTRA DETAILS (all optional) ---------- */
  dressCode: "",             // e.g. "Black & Gold"
  rsvpDeadline: "",          // e.g. "2026-12-20" or "Please reply by 20 December"
  rsvpLink: "",              // paste a Google Forms link. "" = RSVP button hidden

  /* A short programme, like the reference reel's "Program Timeline".
     Leave as [] to hide it. Example of how to fill it:
       { time: "7:00 PM", title: "Guests arrive" },
       { time: "8:00 PM", title: "Cake cutting" },
       { time: "8:30 PM", title: "Dinner" }                                   */
  schedule: [],

  /* ---------- WORDS ----------
     {name} and {age} are filled in automatically.                           */
  invitationMessage:
    "Some milestones deserve to be celebrated in the company of the people " +
    "who make life special. Please join us as we celebrate 50th wonderful " +
    "years of Mahesh More, surrounded by family, friends, laughter, and " +
    "unforgettable memories.",

  finaleTitle: "Let's Make It a Night to Remember",
  thankYouMessage:
    "Thank you for being part of Dad's story. Your presence is the best gift we could ask for.",

  /* ---------- PHOTOS ----------
     Put image files in  assets/images/  and list them here.
     1st photo  = the big portrait (arch frame)
     the others = the scrolling gallery
     Simple way:   "assets/images/dad-portrait.jpg",
     With caption: { src: "assets/images/dad-1.jpg", caption: "Goa, 2015" },
     Face cut off? add  position: "center top"  (or "center 20%")           */
  photos: [
    "assets/images/dad-portrait.jpg",
    "assets/images/dad-memory-1.jpg",
    "assets/images/dad-memory-2.jpg",
    "assets/images/dad-memory-3.jpg"
  ],
  finalePhoto: "",   // "" = reuse the first photo in the finale

  /* ---------- MUSIC (optional) ----------
     Put your own licensed/royalty-free mp3 at the path below.
     If the file doesn't exist the music button simply doesn't appear.       */
  musicEnabled: true,
  musicFile: "assets/audio/music.mp3"
};
