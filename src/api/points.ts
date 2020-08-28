import { Player, PlayerItemEntry, EntryScore } from "../types";
import { getRaids, isBonusRaid, Raid } from "./raids";

const hasBonusAttendance = (attendance: number) => attendance >= 0.8;

const getPlayerBonusRaids = (player: Player) => {
    const raids = getRaids();
    let bonus = 0;
    for (const raidIndex in raids) {
        const raid = raids[raidIndex];
        if (isBonusRaid(raid)) {
            const playerAttendance = raid.players.find(o => o.character === player.name);
            if (playerAttendance && hasBonusAttendance(playerAttendance.attendance)) {
                bonus += 1;
            }
        }
    }

    return bonus;
}

// TODO: Real filter to get only attendance raids
const getAttendanceRaids = (raids: Raid[]) => raids.slice(-10);

// TODO: Fill out with data for new players
const getPlayerAttendance = (player: Player): number => {
    if (!player.calculatedAttendance) {
        const raids = getAttendanceRaids(getRaids());
        
        let attendance = [];
        for (const raidIndex in raids) {
            const raid = raids[raidIndex];
    
            const playerAttendance = raid.players.find(o => o.character === player.name);
            if (playerAttendance) {
                attendance.push(playerAttendance.attendance)
            } else {
                attendance.push(0);
            }
        }
    
        player.calculatedAttendance = attendance.reduceRight((a, b) => a + b) / attendance.length;
    }
    return player.calculatedAttendance
}

export const getFinalScore = (entry: PlayerItemEntry, player: Player ): number => {
    return entry.score + getItemBonus(entry, player) + getPositionBonus(player) + getAttendanceBonus(player);
};

// TODO: Handle bonus on item that exists more than once in a players list.
// Bonus should only count for the top entry when gained, but additional
// bonuses after fulfilling the first slot should still add to the second.
export const getItemBonus = (entry: PlayerItemEntry, player: Player): number => {
    const raids = getRaids();
    let bonus = 0;

    if (entry.item === null) return bonus;

    for (const raidIndex in raids) {
        const raid = raids[raidIndex];
        const bonusEntry = raid.itemBonus.find(
            item => item.character === player.name && entry.item && entry.item.name === item.item
        );
        if (bonusEntry) bonus += 1;
    }

    return bonus;
};

export const getPositionBonus = (player: Player): number => {
    if (!player.positionBonus) {
        player.positionBonus = getPlayerBonusRaids(player);
    }
    return player.positionBonus;
};

export const getAttendanceBonus = (player: Player) => {
    return getPlayerAttendance(player) * 10;
};

export const getEntryScore = (entry: PlayerItemEntry, player: Player): EntryScore => {
    if (!entry.calcualtedScore) {
        entry.calcualtedScore = {
            base: entry.score,
            position: getPositionBonus(player),
            item: getItemBonus(entry, player),
            attendance: getAttendanceBonus(player),
            total: getFinalScore(entry, player),
        }
    }
    return entry.calcualtedScore;
}