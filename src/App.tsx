import { useState, useRef, createContext,useEffect} from "react";
import './App.css';
import SearchPage from "./SearchPage";
import ExpandedSongPage from "./ExpandedSongPage";
export const currentSongContext = createContext({} as any);

export default function App() {
    const [currentSongUrl, setCurrentSongUrl] = useState('S2');
    const songRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [mode, setMode] = useState("search");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlaylistId, setCurrentPlaylistId] = useState(2);
    const [currentAlbumId, setCurrentAlbumId] = useState(2);
    const [currentTitle, setCurrentTitle] = useState("2002");
    const [currentArtist, setCurrentArtist] = useState("Anne Marie");
    const [infiniteMode, setInfiniteMode] = useState(false);

    const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('all');


    const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
        };

    const [originalQueue, setOriginalQueue] = useState<Song[]>([]);
    const [displayQueue, setDisplayQueue] = useState<Song[]>([]); // This is what you map over
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffleMode, setShuffleMode] = useState(false);

    const toggleShuffle = () => {
    if (!shuffleMode) {
        // Turning Shuffle ON
        const currentSong = displayQueue[currentIndex];
        const shuffled = shuffleArray(originalQueue);
        
        // Crucial: Move the currently playing song to the top of the shuffled list
        // so the music doesn't jump to a different track immediately
        const filtered = shuffled.filter(s => s.id !== currentSong.id);
        const finalQueue = [currentSong, ...filtered];
        
        setDisplayQueue(finalQueue);
        setCurrentIndex(0); // Current song is now at 0
        setShuffleMode(true);
    } else {
        // Turning Shuffle OFF
        const currentSong = displayQueue[currentIndex];
        const originalIdx = originalQueue.findIndex(s => s.id === currentSong.id);
        
        setDisplayQueue(originalQueue);
        setCurrentIndex(originalIdx);
        setShuffleMode(false);
    }
    };

    function handleTimeUpdate() {
    const audio = songRef.current;
    if (!audio || !audio.duration) return;

    const progress = (songRef.current?.currentTime / songRef.current?.duration) * 100;
    setProgress(progress);
    }

   const playNext = async () => {
    if (repeatMode === 'one') {
        songRef.current!.currentTime = 0;
        songRef.current!.play();
        return;
    }

    if (currentIndex < displayQueue.length - 1) {
        setCurrentIndex(prev => prev + 1);
    } else if (repeatMode === 'all' && displayQueue.length > 0) {
        setCurrentIndex(0);
    } else if (infiniteMode) {
        // INFINITE PLAY LOGIC: Fetch more songs when queue ends
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/song/random?limit=5`);
            const newSongs = await response.json();
            const formattedSongs = newSongs.map((s: any) => ({
                id: s.id,
                title: s.title,
                artist: s.artist,
                album_id: s.album_id,
                filename: `S${s.id}`
            }));
            setDisplayQueue(prev => [...prev, ...formattedSongs]);
            setOriginalQueue(prev => [...prev, ...formattedSongs]);
            setCurrentIndex(prev => prev + 1);
        } catch (e) {
            setIsPlaying(false);
        }
    } else {
        setIsPlaying(false);
    }
};
  
        // Sync UI and Audio tag whenever the Index or the Queue changes
useEffect(() => {
  if (displayQueue?.length > 0) {
    const nextSong = displayQueue[currentIndex];
    
    // Update metadata
    setCurrentSongUrl(nextSong.filename);
    setCurrentTitle(nextSong.title);
    setCurrentArtist(nextSong.artist);
    setCurrentAlbumId(nextSong.album_id);
  }
}, [currentIndex, displayQueue]);

// SECOND EFFECT: Specifically for handling the actual playback
useEffect(() => {
  if (isPlaying && songRef.current) {
    // We use a small timeout or just call load() to ensure 
    // the browser recognizes the new SRC attribute
    songRef.current.load(); 
    songRef.current.play().catch(error => {
      console.log("Autoplay prevented or interrupted:", error);
    });
  }
}, [currentSongUrl, isPlaying]); // Trigger this when the URL changes

    return (
        <currentSongContext.Provider value = {{
            currentSongUrl,setCurrentSongUrl,
            songRef, 
            progress,setProgress,
            mode, setMode,
            isPlaying, setIsPlaying, 
            currentPlaylistId, setCurrentPlaylistId, 
            currentTitle, setCurrentTitle, 
            currentArtist, setCurrentArtist,
            currentAlbumId, setCurrentAlbumId,
            originalQueue,setOriginalQueue,
            displayQueue,setDisplayQueue,

    currentIndex,
    setCurrentIndex,
    repeatMode,
    setRepeatMode,
}}>
                

            <div className="phone-css-wrapper">
                <div>
                    <audio 
                    ref={songRef} 
                    src={`${import.meta.env.VITE_API_BASE_URL}/song/${currentSongUrl}.m4a`} 
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={playNext}
                    />
                </div>
                {mode === "search" && <SearchPage />}
                {mode === "expanded" && <ExpandedSongPage />}
            </div>
        </currentSongContext.Provider>
    )
} 