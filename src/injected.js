'use strict';

(() => {
    function getHeaderRows(roomName, currentDate) {
        return [
            ["Raum Name:", roomName],
            ["Zeitpunkt des Exports:", currentDate.toLocaleString()],
            [],
            ["Teilnehmer", "Sprechzeit"]
        ];
    }
    function getTimeStringForSpeaker(speakerDetails) {
        const dominantTime = speakerDetails.totalDominantSpeakerTime;
        const dominantTimeDate = new Date(dominantTime);
        let timeString = '';
        if (dominantTime < 86400000) {
            timeString = dominantTimeDate.toLocaleTimeString('de-DE', { timeZone: 'UTC' });
        } else {
            const numberOfDays = Math.floor(86400000 / 1000 / 60 / 60 / 24);
            timeString = numberOfDays + ' Tage ' + dominantTimeDate.toLocaleTimeString('de-DE', { timeZone: 'UTC' });
        }
        return timeString;
    }
    function getSpeakerRows(speakerStats) {
        return Object.values(speakerStats).map(speakerDetails => {
            const name = speakerDetails.displayName || 'Unbekannt';
            const timeString = getTimeStringForSpeaker(speakerDetails);
            return [name, timeString];
        });
    }
    function getRows(speakerStats, roomName, currentDate) {
        const speakerRows = getSpeakerRows(speakerStats);
        const headerRows = getHeaderRows(roomName, currentDate);
        return [...headerRows, ...speakerRows];
    }
    function getEncodedUri(rows) {
        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(";")).join("\n");
        return encodeURI(csvContent);
    }
    function getFileName(roomName, currentDate) {
        return roomName + '_' + currentDate.toISOString().split('T')[0] + ".csv";
    }
    function downloadCSVFile(fileName, encodedUri) {
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
    }

    if (!window.APP || !window.APP.conference || !window.APP.conference.roomName) {
        alert('Sie müssen sich in einem Meeting Raum befinden.');
        return;
    }
    const speakerStats = window.APP.conference.getSpeakerStats();
    const currentDate = new Date();
    const roomName = window.APP.conference.roomName;
    const rows = getRows(speakerStats, roomName, currentDate);
    const encodedUri = getEncodedUri(rows);
    const fileName = getFileName(roomName, currentDate);
    downloadCSVFile(fileName, encodedUri);
})();
