
'use client';

import {
    StreamVideo,
    StreamVideoClient,
    User,
    StreamCall,
    StreamTheme,
    SpeakerLayout,
    CallControls,
    useCall,
    useStreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export default function VideoStage({ interview, currentUser }) {
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const user = {
            id: currentUser._id || currentUser.id,
            name: currentUser.name,
            image: `https://getstream.io/random_png/?id=${currentUser._id}&name=${currentUser.name}`,
        };

        // Initialize client
        // In a real app, token should be generated server-side for security.
        // For this demo/hackathon, we might use dev token or client-side generation if allowed (insecure)
        // Stream provides dev tokens for testing if auth is disabled, but usually we need server.
        // We'll assume a token provider endpoint exists or use a dev token logic if allowed.
        const tokenProvider = async () => {
            const response = await fetch(`/api/stream-token?userId=${user.id}`);
            const data = await response.json();
            return data.token;
        };

        const myClient = new StreamVideoClient({ apiKey, user, tokenProvider });
        setClient(myClient);

        const myCall = myClient.call('default', interview._id);
        myCall.join({ create: true });
        setCall(myCall);

        return () => {
            myClient.disconnectUser();
            setClient(null);
            setCall(null);
        };
    }, [currentUser, interview._id]);

    if (!client || !call) return <div className="text-white p-10">Initializing Video...</div>;

    return (
        <StreamVideo client={client}>
            <StreamTheme className="h-full">
                <StreamCall call={call}>
                    <div className="h-full flex flex-col items-center justify-center bg-gray-900">
                        <SpeakerLayout />
                        <div className="mt-4">
                            <CallControls />
                        </div>
                    </div>
                </StreamCall>
            </StreamTheme>
        </StreamVideo>
    );
}
