import React from 'react';
import { getItemIcon } from '../api/loot';
import { Item } from '../types'
import style from './ItemLink.module.css';

const wowheadIconUrl = 'https://wow.zamimg.com/images/wow/icons'
const iconExtension = (size: string) => size === 'tiny' ? '.gif' : '.jpg';

export const hideWowheadTooltip = () => {
    const element = document.getElementsByClassName('wowhead-tooltip').item(0) as HTMLDivElement;
    if (element) {
        element.style.display = 'none';
    }
}

type ItemLinkProps = {
    item: Item,
    noText?: boolean,
    noTextLink?: boolean,
    size: 'tiny' | 'small' | 'medium' | 'large',
};
const ItemLink = ({ item, noText, noTextLink, size }: ItemLinkProps) => {
    const icon = getItemIcon(item.id);
    const iconStyle: React.CSSProperties = {
        background: `url("${wowheadIconUrl}/${size}/${icon}${iconExtension(size)}") left center no-repeat`,
    };
    const iconClass = [style[`icon--${size}`]];
    if (item.restricted) {
        iconClass.push(style['icon--restricted'])
    }

    // The fulhax for Atiesh T_T
    const displayName = item.name.replace(/\(.*\)/, '');
    const wrapClass = [style.wrap];
    if ([22632, 22589, 22631, 22630].includes(item.id)) {
        wrapClass.push(style.wrapLegendary);
    }

    return (
        <div className={wrapClass.join(' ')}>
            <a href={`https://classic.wowhead.com/item=${item.id}`} target='_blank' className={style.wrap} rel="noopener noreferrer" >
                <span className={iconClass.join(' ')} style={iconStyle} />
                {noText || noTextLink ? null : (
                    <span className={style.text}>
                        {displayName}
                    </span>
                )}
            </a>
            {noTextLink && (
                <span className={style.text}>
                    {displayName}
                </span>
            )}
        </div>
    );
}

export default ItemLink;
