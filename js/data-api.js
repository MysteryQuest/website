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
        // Preserve the stable D1 identifier without breaking legacy views that
        // expect `id` to be a numeric array index for map/table interactions.
        return payload.events.map((event, index) => ({
            ...event,
            d1_id: event.id,
            id: index
        }));
    }

    window.UnverifiedData = Object.freeze({ loadEvents, eventsUrl: EVENTS_URL });
})();
