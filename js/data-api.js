(function () {
    const EVENTS_URL = 'https://unverified-file-privacy-api.nullrecords.workers.dev/api/v1/events';

    async function loadEvents() {
        const response = await fetch(EVENTS_URL, { headers: { Accept: 'application/json' } });
        if (!response.ok) {
            throw new Error(`Public events API failed (${response.status})`);
        }
        const payload = await response.json();
        if (!Array.isArray(payload.events)) {
            throw new Error('Public events API returned an invalid payload');
        }
        return payload.events;
    }

    window.UnverifiedData = Object.freeze({ loadEvents, eventsUrl: EVENTS_URL });
})();
