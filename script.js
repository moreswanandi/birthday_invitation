/* =====================================================================
   script.js — how the invitation BEHAVES
   It reads everything from config.js (birthdayConfig) and fills the page.
   You normally never need to edit this file.

   Parts:  A helpers   B event date maths   C fill the page   D photos
           E gate (open the doors)   F music   G sparkles & confetti
           H scratch card   I countdown   J calendar & maps   K start-up
   ===================================================================== */
(function () {
  'use strict';

  var C = window.birthdayConfig || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- A. HELPERS ---------- */
  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function has(v) { return typeof v === 'string' && v.trim() !== ''; }
  function isPlaceholder(v) { return has(v) && v.trim().charAt(0) === '['; }   // "[like this]"
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fill(text) {                                   // replaces {name} and {age}
    return String(text).replace(/\{name\}/g, C.celebrantName || '').replace(/\{age\}/g, C.age || '');
  }

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---------- B. EVENT DATE MATHS ----------
     We build ONE exact moment in time from date + time + utcOffset, and use it
     for the countdown, Google Calendar and the .ics file, so they all agree. */
  function getEvent() {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(C.eventDate || '');
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var check = new Date(Date.UTC(y, mo - 1, d));
    if (check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null;   // e.g. 2027-02-31

    var timeOk = /^([01]\d|2[0-3]):([0-5]\d)$/.test(C.startTime || '');
    var offOk = /^[+-]\d{2}:\d{2}$/.test(C.utcOffset || '');
    var start = new Date(C.eventDate + 'T' + (timeOk ? C.startTime : '00:00') + ':00' + (offOk ? C.utcOffset : ''));
    if (isNaN(start.getTime())) return null;

    var hours = +C.durationHours > 0 ? +C.durationHours : 3;
    var hh = timeOk ? +C.startTime.slice(0, 2) : 0;
    var mm = timeOk ? C.startTime.slice(3) : '00';
    return {
      start: start,
      end: new Date(start.getTime() + hours * 3600000),
      allDay: !timeOk,
      dayName: DAYS[check.getUTCDay()],
      dateText: d + ' ' + MONTHS[mo - 1] + ' ' + y,
      timeText: timeOk ? ((hh % 12) || 12) + ':' + mm + ' ' + (hh < 12 ? 'AM' : 'PM') : ''
    };
  }

  /* ---------- C. FILL THE PAGE ---------- */
  var ev = getEvent();
  var draft = false;                       // becomes true if any [placeholder] is shown

  function shown(v) { if (isPlaceholder(v)) draft = true; return v; }

  function fillText() {
    var name = shown(C.celebrantName) || 'Our Guest of Honour';
    var age = C.age || '50';
    $('#heroName').textContent = name;
    $('#heroLine').textContent = 'Celebrating ' + age + ' Wonderful Years';
    $('#bigAge').textContent = age;
    $('#sealNum').textContent = age;
    $('#finaleAge').textContent = age;
    $('#heroOccasion').textContent = C.occasion || '';
    if (!has(C.occasion)) $('#heroOccasion').hidden = true;
    document.title = "You're Invited · " + (C.occasion || 'Celebration');

    // Message
    var msg = has(C.invitationMessage) ? C.invitationMessage : '';
    shown(msg);
    $('#messageText').textContent = fill(msg);
    if (!msg) $('#message').hidden = true;

    // Host
    if (has(C.hostName)) {
      shown(C.hostName);
      $('#hostLine').textContent = 'With love, ' + C.hostName;
      $('#finaleHost').textContent = '— ' + C.hostName;
    } else {
      $('#hostLine').hidden = true; $('#finaleHost').hidden = true;
    }

    // Finale
    $('#finaleTitle').textContent = C.finaleTitle || "Let's Make It a Night to Remember";
    if (has(C.thankYouMessage)) $('#thanks').textContent = fill(C.thankYouMessage); else $('#thanks').hidden = true;
  }

  // Little line-art icons for the detail cards
  var ICON = {
    date: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    time: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    place: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    dress: '<svg viewBox="0 0 24 24"><path d="M8 3l4 3 4-3 4 4-3 3v11H7V10L4 7z"/></svg>',
    rsvp: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    host: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>'
  };

  function addCard(container, icon, label, value, sub) {
    var c = el('div', 'info reveal');
    c.innerHTML = ICON[icon] + '<h3>' + esc(label) + '</h3><p>' + esc(value) +
      (sub ? '<small>' + esc(sub) + '</small>' : '') + '</p>';
    container.appendChild(c);
  }

  function fillDetails() {
    var box = $('#detailCards');

    if (ev) addCard(box, 'date', 'Date', ev.dayName + ', ' + ev.dateText);
    else { addCard(box, 'date', 'Date', 'To be announced'); draft = true; }
    if (ev && ev.timeText) addCard(box, 'time', 'Time', ev.timeText);

    if (has(C.venueName) || has(C.venueAddress)) {
      shown(C.venueName); shown(C.venueAddress);
      addCard(box, 'place', 'Venue', C.venueName || C.venueAddress, has(C.venueName) ? C.venueAddress : '');
    }
    if (has(C.dressCode)) addCard(box, 'dress', 'Dress Code', C.dressCode);

    if (has(C.rsvpDeadline)) {
      var t = /^\d{4}-\d{2}-\d{2}$/.test(C.rsvpDeadline)
        ? C.rsvpDeadline.slice(8).replace(/^0/, '') + ' ' + MONTHS[+C.rsvpDeadline.slice(5, 7) - 1] + ' ' + C.rsvpDeadline.slice(0, 4)
        : C.rsvpDeadline;
      addCard(box, 'rsvp', 'Kindly reply by', t);
    }
    if (has(C.hostName)) addCard(box, 'host', 'Hosted by', C.hostName);

    // Directions button
    var link = mapsUrl();
    if (link) { var b = $('#mapsBtn'); b.href = link; b.hidden = false; }

    // RSVP
    if (has(C.rsvpLink)) {
      $('#rsvp').hidden = false;
      $('#rsvpBtn').href = C.rsvpLink;
      $('#rsvpNote').textContent = has(C.rsvpDeadline) ? 'Please let us know by the date above.' : 'We would love to know if you can make it.';
    }

    // Programme
    var list = Array.isArray(C.schedule) ? C.schedule : [];
    list = list.filter(function (s) { return s && has(s.title); });
    if (list.length) {
      $('#scheduleSection').hidden = false;
      list.forEach(function (s) {
        var li = el('li', 'reveal');
        li.innerHTML = (has(s.time) ? '<time>' + esc(s.time) + '</time>' : '') + '<span>' + esc(s.title) + '</span>';
        $('#timelineList').appendChild(li);
      });
    }
  }

  /* ---------- D. PHOTOS ---------- */
  function normPhoto(p) {
    if (typeof p === 'string') return { src: p, caption: '', position: 'center' };
    if (p && typeof p.src === 'string') return { src: p.src, caption: p.caption || '', position: p.position || 'center' };
    return null;
  }

  // Builds one framed photo. If the file is missing: show a labelled
  // placeholder in preview mode, or quietly remove it for real guests.
  function makePhoto(p, cls, onGone) {
    var fig = el('figure', cls);
    var img = new Image();
    img.alt = p.caption || 'Photograph';
    img.decoding = 'async';
    if (cls !== 'arch') img.loading = 'lazy';
    img.style.objectPosition = p.position;
    img.onerror = function () {
      if (draft) {
        fig.innerHTML = '<div class="ph"><span>Photo goes here</span><small>' + esc(p.src) + '</small></div>';
      } else {
        fig.remove();
        if (onGone) onGone();
      }
    };
    img.src = p.src;
    fig.appendChild(img);
    if (p.caption) fig.appendChild(el('figcaption', null, esc(p.caption)));
    return fig;
  }

  function fillPhotos() {
    var photos = (Array.isArray(C.photos) ? C.photos : []).map(normPhoto).filter(Boolean);
    var section = $('#memories');
    if (photos.length) {
      section.hidden = false;
      var check = function () {
        if (!$('#portraitSlot').children.length && !$('#galleryTrack').children.length) section.hidden = true;
      };
      $('#portraitSlot').appendChild(makePhoto(photos[0], 'arch', check));
      var track = $('#galleryTrack');
      photos.slice(1).forEach(function (p) { track.appendChild(makePhoto(p, 'card reveal', check)); });
      if (photos.length < 2) track.hidden = true;
    }

    // Finale photo
    var f = normPhoto(has(C.finalePhoto) ? C.finalePhoto : (photos[0] || null));
    if (f) $('#finalePhotoSlot').appendChild(makePhoto(f, 'circle', function () { $('#finalePhotoSlot').hidden = true; }));
    else $('#finalePhotoSlot').hidden = true;
  }

  /* ---------- E. THE GATE (open the doors) ---------- */
  var opened = false;

  function openInvitation() {
    if (opened) return;
    opened = true;
    startMusic();                                       // allowed: this is a tap
    $('#gate').classList.add('open');
    var showAfter = reduceMotion ? 50 : 1700;           // when curtains are mostly open
    var removeAfter = reduceMotion ? 200 : 3100;
    setTimeout(function () { document.body.classList.add('ready'); }, showAfter);
    setTimeout(function () {
      $('#gate').hidden = true;
      document.documentElement.classList.remove('locked');
      window.scrollTo(0, 0);
    }, removeAfter);
  }

  /* ---------- F. MUSIC ---------- */
  var audio = null, musicWanted = false;

  function setMusicButton(playing) {
    var b = $('#musicBtn');
    b.classList.toggle('off', !playing);
    b.setAttribute('aria-label', playing ? 'Turn music off' : 'Turn music on');
  }

  function startMusic() {
    if (!C.musicEnabled || !has(C.musicFile)) return;
    try {
      audio = new Audio(C.musicFile);
      audio.loop = true;
      audio.volume = 0.55;
      var p = audio.play();
      if (p && p.then) {
        p.then(function () { musicWanted = true; $('#musicBtn').hidden = false; setMusicButton(true); })
         .catch(function () { audio = null; });          // missing/blocked: stay silent, button stays hidden
      }
      audio.addEventListener('error', function () { audio = null; $('#musicBtn').hidden = true; });
    } catch (e) { audio = null; }
  }

  function toggleMusic() {
    if (!audio) return;
    if (audio.paused) { audio.play(); setMusicButton(true); } else { audio.pause(); setMusicButton(false); }
  }

  /* ---------- G. SPARKLES & CONFETTI ---------- */
  function startSparkles() {
    var cv = $('#sparkles'), ctx = cv.getContext('2d'), dots = [], w, h;
    var count = window.innerWidth < 600 ? 28 : 55;

    function size() { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; }
    function make(first) {
      return { x: Math.random() * w, y: first ? Math.random() * h : h + 10, r: Math.random() * 1.8 + .6,
               vy: Math.random() * .35 + .12, tw: Math.random() * 6.28 };
    }
    size();
    for (var i = 0; i < count; i++) dots.push(make(true));
    window.addEventListener('resize', size);

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.tw += .03; d.y -= d.vy;
        if (d.y < -10) dots[i] = make(false);
        ctx.globalAlpha = .25 + .45 * Math.abs(Math.sin(d.tw));
        ctx.fillStyle = '#f3e0a8';
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
    }
    if (reduceMotion) { draw(); return; }                // one still frame only
    (function loop() { if (!document.hidden) draw(); requestAnimationFrame(loop); })();
  }

  var confettiRunning = false;
  function confetti() {
    if (reduceMotion || confettiRunning) return;
    confettiRunning = true;
    var cv = el('canvas'); cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:120;pointer-events:none';
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), w = cv.width = window.innerWidth, h = cv.height = window.innerHeight;
    var colors = ['#d4b06a', '#f3e0a8', '#f6efe0', '#9a7a3a', '#8a2a3e'];
    var bits = [];
    for (var i = 0; i < 110; i++) {
      bits.push({ x: w / 2 + (Math.random() - .5) * 80, y: h * .55, vx: (Math.random() - .5) * 12, vy: -Math.random() * 13 - 4,
                  s: Math.random() * 7 + 4, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length] });
    }
    var start = Date.now();
    (function frame() {
      var t = Date.now() - start;
      ctx.clearRect(0, 0, w, h);
      bits.forEach(function (b) {
        b.vy += .28; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.globalAlpha = Math.max(0, 1 - t / 3600);
        ctx.fillStyle = b.c; ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        ctx.restore();
      });
      if (t < 3600) requestAnimationFrame(frame);
      else { cv.remove(); confettiRunning = false; }
    })();
  }

  /* ---------- H. SCRATCH CARD (date reveal) ---------- */
  function setupScratch() {
    if (!ev) return;                                     // no valid date -> section stays hidden
    $('#dateSection').hidden = false;
    $('#suDay').textContent = ev.dayName;
    $('#suDate').textContent = ev.dateText;
    $('#suTime').textContent = ev.timeText ? 'at ' + ev.timeText : '';
    if (!ev.timeText) $('#suTime').hidden = true;

    var cv = $('#scratchCanvas'), ctx = cv.getContext('2d');
    var revealed = false, drawing = false, w = 0, h = 0, ratio = Math.min(window.devicePixelRatio || 1, 2);

    function paintFoil() {
      var box = cv.getBoundingClientRect();
      w = Math.round(box.width) || 300; h = Math.round(box.height) || 210;
      cv.width = w * ratio; cv.height = h * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      var g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#9a7a3a'); g.addColorStop(.35, '#f3e0a8'); g.addColorStop(.6, '#d4b06a'); g.addColorStop(1, '#9a7a3a');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,.18)';            // little glitter dots
      for (var i = 0; i < 160; i++) ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      ctx.fillStyle = '#4a360f'; ctx.textAlign = 'center';
      ctx.font = '38px "Great Vibes", cursive'; ctx.fillText('Scratch to Reveal', w / 2, h / 2 + 8);
    }

    function finish() {
      if (revealed) return;
      revealed = true;
      cv.classList.add('done');
      $('#revealBtn').hidden = true;
      $('#calendarBtns').hidden = false;
      confetti();
    }

    function scratchAt(e) {
      var box = cv.getBoundingClientRect();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(e.clientX - box.left, e.clientY - box.top, 24, 0, 6.283); ctx.fill();
    }

    function percentCleared() {                          // sample the canvas to see how much is gone
      var data = ctx.getImageData(0, 0, cv.width, cv.height).data, clear = 0, total = 0;
      for (var i = 3; i < data.length; i += 4 * 40) { total++; if (data[i] < 128) clear++; }
      return clear / total;
    }

    cv.addEventListener('pointerdown', function (e) { drawing = true; cv.setPointerCapture(e.pointerId); scratchAt(e); });
    cv.addEventListener('pointermove', function (e) { if (drawing) scratchAt(e); });
    function stop() { if (!drawing) return; drawing = false; try { if (percentCleared() > .4) finish(); } catch (err) { finish(); } }
    cv.addEventListener('pointerup', stop);
    cv.addEventListener('pointercancel', stop);
    $('#revealBtn').addEventListener('click', finish);   // fallback for anyone who can't scratch

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintFoil); else paintFoil();
    paintFoil();
    window.addEventListener('resize', function () { if (!revealed && !drawing) paintFoil(); });
  }

  /* ---------- I. COUNTDOWN ---------- */
  function setupCountdown() {
    if (!ev) return;
    $('#countdown').hidden = false;
    function tick() {
      var diff = ev.start.getTime() - Date.now();
      if (diff <= 0) {
        $('#countGrid').hidden = true;
        $('#countDone').hidden = false;
        $('#countDone').textContent = (Date.now() < ev.end.getTime())
          ? 'The celebration is happening right now!'
          : 'The celebration has taken place. Thank you for being part of it!';
        return false;
      }
      var s = Math.floor(diff / 1000);
      $('#cDays').textContent = pad(Math.floor(s / 86400));
      $('#cHours').textContent = pad(Math.floor(s % 86400 / 3600));
      $('#cMins').textContent = pad(Math.floor(s % 3600 / 60));
      $('#cSecs').textContent = pad(s % 60);
      return true;
    }
    if (!tick()) return;
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }

  /* ---------- J. CALENDAR & MAPS ---------- */
  function eventTitle() { return fill(C.occasion || 'Birthday Celebration') + (has(C.celebrantName) && !isPlaceholder(C.celebrantName) ? ' – ' + C.celebrantName : ''); }
  function eventPlace() {
    return [C.venueName, C.venueAddress].filter(function (v) { return has(v) && !isPlaceholder(v); }).join(', ');
  }
  function stamp(d) { return d.toISOString().replace(/[-:]|\.\d{3}/g, ''); }        // 20270101T133000Z
  function dayStamp(d) { return d.toISOString().slice(0, 10).replace(/-/g, ''); }

  function mapsUrl() {
    if (has(C.mapsLink)) return C.mapsLink;
    var q = eventPlace();
    return q ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) : '';
  }

  function setupCalendar() {
    if (!ev) return;
    var dates;
    if (ev.allDay) {
      var next = new Date(ev.start.getTime() + 86400000);
      dates = C.eventDate.replace(/-/g, '') + '/' + next.toISOString().slice(0, 10).replace(/-/g, '');
    } else {
      dates = stamp(ev.start) + '/' + stamp(ev.end);
    }
    $('#gcalBtn').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(eventTitle()) +
      '&dates=' + dates +
      (eventPlace() ? '&location=' + encodeURIComponent(eventPlace()) : '');

    $('#icsBtn').addEventListener('click', function (e) {
      e.preventDefault();
      var esc2 = function (s) { return String(s).replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n'); };
      var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Birthday Invitation//EN', 'BEGIN:VEVENT',
        'UID:' + stamp(ev.start) + '-birthday@invitation', 'DTSTAMP:' + stamp(new Date()),
        ev.allDay ? 'DTSTART;VALUE=DATE:' + dates.split('/')[0] : 'DTSTART:' + stamp(ev.start),
        ev.allDay ? 'DTEND;VALUE=DATE:' + dates.split('/')[1] : 'DTEND:' + stamp(ev.end),
        'SUMMARY:' + esc2(eventTitle())];
      if (eventPlace()) lines.push('LOCATION:' + esc2(eventPlace()));
      lines.push('END:VEVENT', 'END:VCALENDAR');
      var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'birthday-invitation.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
  }

  /* ---------- K. START-UP ---------- */
  function setupReveal() {              // fade/slide items in as they scroll into view
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(function (i) { i.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .15 });
    items.forEach(function (i) { io.observe(i); });

    // Little confetti burst the first time the finale comes into view
    var fin = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { confetti(); fin.disconnect(); }
    }, { threshold: .6 });
    fin.observe($('#finale'));
  }

  function init() {
    fillText();
    fillDetails();
    fillPhotos();
    setupScratch();
    setupCountdown();
    setupCalendar();
    startSparkles();

    if (draft || !ev) $('#draftBar').hidden = false;      // reminder: unfinished invitation

    $('#openBtn').addEventListener('click', openInvitation);
    $('#sealBtn').addEventListener('click', openInvitation);
    $('#musicBtn').addEventListener('click', toggleMusic);
    $('#confettiBtn').addEventListener('click', confetti);

    document.documentElement.classList.add('locked');     // keep page still until doors open
    setupReveal();
  }

  // If anything goes wrong, never trap the guest behind the doors.
  try { init(); }
  catch (err) {
    if (window.console) console.error('Invitation error:', err);
    var g = $('#gate'); if (g) g.hidden = true;
    document.documentElement.classList.remove('locked');
    document.body.classList.add('ready');
    document.querySelectorAll('.reveal').forEach(function (i) { i.classList.add('in'); });
  }
})();
