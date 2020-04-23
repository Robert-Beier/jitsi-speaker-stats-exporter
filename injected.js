'use strict';

function exportCSV() {
    if (!window.APP || !window.APP.conference || !window.APP.conference.roomName) {
        alert('Sie müssen sich in einem Meeting Raum befinden.');
        return;
    }
    const speakerStats = window.APP.conference.getSpeakerStats();
    const currentDate = new Date();
    const roomName = window.APP.conference.roomName;

    const speakerRows = Object.values(speakerStats).map(speakerDetails => {
        const name = speakerDetails.displayName || 'Unbekannt';
        const dominantTime = speakerDetails.totalDominantSpeakerTime;
        const dominantTimeDate = new Date(dominantTime);
        let timeString = '';
        if (dominantTime < 86400000) {
            timeString = dominantTimeDate.toLocaleTimeString('de-DE', { timeZone: 'UTC' });
        } else {
            const numberOfDays = Math.floor(86400000 / 1000 / 60 / 60 / 24);
            timeString = numberOfDays + ' Tage ' + dominantTimeDate.toLocaleTimeString('de-DE', { timeZone: 'UTC' });
        }
        return [name, timeString];
    });

    const headerRows = [
        ["Raum Name:", roomName],
        ["Zeitpunkt des Exports:", currentDate.toLocaleString()],
        [],
        ["Teilnehmer", "Sprechzeit"]
    ];

    const rows = [...headerRows, ...speakerRows];

    let csvContent = "data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(";")).join("\n");
    var encodedUri = encodeURI(csvContent);

    const fileName = roomName + '_' + currentDate.toISOString().split('T')[0] + ".csv";
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);

    link.click();
}

exportCSV();
