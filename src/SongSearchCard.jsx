import { useContext } from "react";
import menuVerticalBlack from './assets/menu-vertical-black.png';
import './SongSearchCard.css';
import { currentSongContext } from "./App";

export default function SongSearchCard({ title, artist, album_id, id }) {
    // Pull queue state from context
    const { 
        setCurrentAlbumId, 
        setCurrentSongUrl, 
        setCurrentTitle, 
        setCurrentArtist, 
        setProgress, 
        songRef,
        setDisplayQueue, setOriginalQueue,displayQueue,originalQueue,setCurrentIndex,setIsPlaying
    } = useContext(currentSongContext);

    // This function plays the song IMMEDIATELY
function handleSongSelect() {
    // Ensure displayQueue is defined
    if (!displayQueue) return; 

    const index = displayQueue.findIndex(s => s.id === id);
    if (index !== -1) {
        setCurrentIndex(index);
    } else {
        // If song isn't in queue, add it and play it
        const newSong = { id, title, artist, album_id, filename: `S${id}` };
        setDisplayQueue([newSong]);
        setOriginalQueue([newSong]);
        setCurrentIndex(0);
    }
    
    setIsPlaying(true);

}
    // This function adds the song to the END of the list
function addToQueue(e) {
    e.stopPropagation();

    const newSong = {
        id: id,
        title: title,
        artist: artist,
        album_id: album_id,
        filename: `S${id}`
    };

    // Update both so shuffle/unshuffle stays in sync
    setDisplayQueue(prev => [...prev, newSong]);
    setOriginalQueue(prev => [...prev, newSong]);
    
    console.log(`${title} added to queue`);
}
    return (
        <div className="song-search-card" onClick={handleSongSelect}>
            <img 
                src={`${import.meta.env.VITE_API_BASE_URL}/pictures/AL${album_id}.jpg`} 
                alt={`${title} album cover`} 
                className="song-search-card-thumbnail"
            />
            <div className="song-search-card-text">
                <h3 style={{fontSize: "16px", fontWeight: "700"}}>{title}</h3>
                <p style={{fontSize: "12px", color: "var(--grey)"}}>{artist}</p>
            </div>
            
            {/* The menu icon now has its own click handler */}
            <img 
                src={menuVerticalBlack} 
                alt="Menu" 
                className="song-search-card-options"
                onClick={addToQueue} 
            />
        </div>
    );
}