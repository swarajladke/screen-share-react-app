import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * States for the screen share lifecycle
 */
export type ScreenShareState =
    | 'idle'
    | 'requesting'
    | 'granted'
    | 'cancelled'
    | 'denied'
    | 'ended'
    | 'unsupported'
    | 'error';

interface ScreenShareResult {
    state: ScreenShareState;
    stream: MediaStream | null;
    error: string | null;
    startSharing: () => Promise<void>;
    stopSharing: () => void;
    metadata: {
        resolution: string;
        label: string;
        displaySurface: string;
    } | null;
}

/**
 * Custom hook to handle browser screen sharing lifecycle
 */
export const useScreenShare = (): ScreenShareResult => {
    const [state, setState] = useState<ScreenShareState>('idle');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<{ resolution: string; label: string; displaySurface: string } | null>(null);

    const streamRef = useRef<MediaStream | null>(null);

    /**
     * Helper to stop all tracks and clear references
     */
    const cleanupStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                track.onended = null;
            });
            streamRef.current = null;
            setStream(null);
            setMetadata(null);
        }
    }, []);

    /**
     * Updates resolution and label from the stream's video track
     */
    const updateMetadata = (s: MediaStream) => {
        const videoTrack = s.getVideoTracks()[0];
        if (videoTrack) {
            const settings = videoTrack.getSettings();
            setMetadata({
                resolution: settings.width && settings.height
                    ? `${settings.width}x${settings.height}`
                    : 'Unknown',
                label: videoTrack.label || 'Screen Stream',
                displaySurface: (settings as any).displaySurface || 'unknown'
            });
        }
    };

    /**
     * Main function to request screen share
     */
    const startSharing = useCallback(async () => {
        // Check for browser support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            setState('unsupported');
            setError('Your browser does not support screen sharing.');
            return;
        }

        // Reset state and cleanup any existing stream
        cleanupStream();
        setError(null);
        setState('requesting');

        try {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } },
                audio: false
            });

            streamRef.current = mediaStream;
            setStream(mediaStream);
            setState('granted');
            updateMetadata(mediaStream);

            // Handle stream lifecycle (e.g. user clicks "Stop Sharing" in browser UI)
            const videoTrack = mediaStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.onended = () => {
                    setState('ended');
                    cleanupStream();
                };
            }
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                // User cancelled or denied permission
                // In some browsers, cancelling the picker is also NotAllowedError
                setState('denied');
                setError('Permission denied or picker cancelled.');
            } else if (err.name === 'AbortError') {
                setState('cancelled');
                setError('Screen share request was aborted.');
            } else {
                setState('error');
                setError(err.message || 'An unexpected error occurred.');
            }
            cleanupStream();
        }
    }, [cleanupStream]);

    /**
     * Manually stop sharing
     */
    const stopSharing = useCallback(() => {
        cleanupStream();
        setState('idle');
    }, [cleanupStream]);

    /**
     * Cleanup on unmount to avoid memory leaks and stray tracks
     */
    useEffect(() => {
        return () => {
            cleanupStream();
        };
    }, [cleanupStream]);

    return {
        state,
        stream,
        error,
        startSharing,
        stopSharing,
        metadata
    };
};
