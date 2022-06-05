import Link from 'next/link';

export default function GuildCard({ guildID, guildIcon = null, guildName, isOwner = false,  guildPermissions = 0 }) {
    const icon: string = guildIcon ? `https://cdn.discordapp.com/icons/${guildID}/${guildIcon}.${guildIcon.startsWith('a_') ? 'gif' : 'webp'}?size=512` : 'https://i.robertify.me/images/rykx6.png';

    // Bitwise operations to check if the user has MANAGE_GUILD
    let isModerator: boolean = isOwner ? false : (guildPermissions & (1 << 5)) === (1 << 5);

    // If the user doesn't have MANAGE_GUILD check if they have ADMINISTRATOR
    isModerator ||= (guildPermissions & (1 << 3)) == (1 << 3);

    // When guildPermission is 0 it caused the value to be incorrectly true.
    // This corrects that
    isModerator = !guildPermissions ? false : isModerator;

    return (
        <div className="guildCard">
            <div className='guildCard--banner'>
                { isOwner === true ?
                    <div className='guildCard--owner-container'>
                        <img loading='lazy' decoding='async' className='guildCard--owner-glyph' src='https://i.robertify.me/images/gmqf5.png' />
                        <span className='guildCard--owner-tooltip'>Server Owner</span>                
                    </div>
                    : isModerator && 
                        <div className='guildCard--owner-container'>
                            <img loading='lazy' decoding='async' className='guildCard--owner-glyph' src='https://i.robertify.me/images/bhg1n.png' />
                            <span className='guildCard--owner-tooltip'>Server Moderator</span>  
                        </div>
                }
                <img className='guildCard--icon' src={icon} alt={`${guildName} Guild Icon`} />
            </div>
            <div className='guildCard--text'>
                <h2 className='guildCard--name'>{guildName}</h2>
                <Link className='guildCard--button' href={`/dashboard/guilds/${guildID}`}>Configure</Link>
            </div>
        </div>
    )
}