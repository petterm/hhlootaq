import React from 'react';
import { PlayerItemEntry } from '../types'
import { Link } from 'react-router-dom';
import { getPlayer } from '../api';
import PlayerName from './PlayerName';

type DropRowPlayerProps = { playerEntry: PlayerItemEntry, playerName: string };
const DropRowPlayer = ({ playerEntry, playerName }: DropRowPlayerProps) => {
    const player = getPlayer(playerName);
    return (
        <div style={{ display: 'flex', marginRight: 5, backgroundColor: playerEntry.received ? '#1d3d1d' : 'none' }}>
            <div style={{
                marginRight: 5,
                padding: '0 5px',
                width: 27,
                textAlign: 'right',
            }}>
                {playerEntry.score}
            </div>
            <div style={{ width: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                    <PlayerName player={player} />
                </Link>
            </div>
        </div>
    );
}

export default DropRowPlayer;
