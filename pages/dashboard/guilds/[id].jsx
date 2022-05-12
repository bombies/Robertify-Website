import Layout from "../../../components/Layout";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchAllDiscordUserInfo, fetchDiscordGuildInfo } from '../../../utils/APIUtils';
import Link from 'next/link';
import Toggle from "../../../components/Toggle";
import SelectMenu from "../../../components/SelectMenu";
import TextOptionList from "../../../components/TextOptionList";

function sortChannelsByCategory(categories, channels) {
    const channelsSorted = categories.map(categoryObj => {
        const channelArr = channels.filter(channelObj => channelObj.parent_id === categoryObj.id);
        if (!channelArr.length)
            return;
        return {
            [categoryObj.id]: { channels: [...channels.filter(channelObj => channelObj.parent_id === categoryObj.id)], category_name: categoryObj.name }
        }   
    }).filter(obj => obj);
    const channelsWithoutCategory = channels.filter(channelObj => !channelObj.parent_id);
    if (channelsWithoutCategory.length)
        channelsSorted.push({ noCategory: { channels: [...channelsWithoutCategory], category_name: 'No Category'} })
    return channelsSorted;
}

export default function GuildPage({ token, userInfo, guildInfo, dbGuildInfo, fullGuildInfo, hasAccess, localHostName }) {
    const router = useRouter();
    
    useEffect(() => {
        if (!hasAccess)
            router.push(`https://discord.com/oauth2/authorize?client_id=893558050504466482&permissions=524023090512&redirect_uri=${encodeURI(`${localHostName}/callback/discord/guild/invite`)}&response_type=code&scope=identify%20guilds%20bot&guild_id=${guildInfo.id}&disable_guild_select=true`)
    }, []);

    const categories = fullGuildInfo.channels.filter(channelObj => channelObj.type === 4);
    const textChannels = fullGuildInfo.channels.filter(channelObj => channelObj.type === 0);
    const voiceChannels = fullGuildInfo.channels.filter(channelObj => channelObj.type === 2);

    const roleNamesSorted = fullGuildInfo.roles.map(roleObj => (
        {
            name: roleObj.name,
            id: roleObj.id,
            icon: <div className="circle" style={{ backgroundColor: `#${parseInt(roleObj.color || 10592673, 10).toString(16).padStart(6, '0')}`, width: '1rem', height: '1rem' }}></div> 
        }
    )).sort((a, b) => a.name.localeCompare(b.name));

    const textChannelsSorted = sortChannelsByCategory(categories, textChannels);
    const voiceChannelsSorted = sortChannelsByCategory(categories, voiceChannels);

    let hasPerms = guildInfo.owner ? false : (Number(guildInfo.permissions) & (1 << 5)) === (1 << 5);
    hasPerms ||= (Number(guildInfo.permissions) & (1 << 3)) == (1 << 3);
    hasPerms = !Number(guildInfo.permissions) ? false : hasPerms;

    const [ changeMade, setChangeMade ] = useState(false);
    const [ togglesState, setTogglesState ] = useState(dbGuildInfo.toggles);
    
    const toggleState = (stateName) => {
        if (!hasPerms) return;

        setTogglesState(oldState => ({
            ...oldState,
            [stateName]: !oldState[stateName]
        }));
    }

    const toggleInnerState = (objectName, stateName) => {
        if (!hasPerms) return;

        setTogglesState(oldState => ({
            ...oldState,
            [objectName]: {
                ...oldState[objectName],
                [stateName]: !oldState[objectName][stateName]
            }
        }));
    }

    const [ discordInfoState ] = useState({
        userInfo: userInfo,
        guildInfo: guildInfo
    });
    const guild = discordInfoState.guildInfo;

    const [ djSelectObj, setDjSelectObj ] = useState({
        optionsVisible: false,
        selectValues: [],
        shownOptions: [...roleNamesSorted],
        searchText: ''
    });

    const toggleDjOptionsVisible = () => {
        if (!hasPerms) return;

        setDjSelectObj(oldObj => ({
            ...oldObj,
            optionsVisible: !oldObj.optionsVisible
        }));
    }

    const updateDjSelectValues = (isActive, value) => {
        updateMenuSelectedValues(isActive, setDjSelectObj, value, true);
    }

    const updateDjSearchText = (value) => {
        if (!hasPerms) return;

        setDjSelectObj(oldObj => ({
            ...oldObj,
            searchText: value,
            shownOptions: roleNamesSorted.filter(val => val.toLowerCase().includes(value.toLowerCase()))
        }));
    }

    const [ vcSelectObj, setVcSelectObj ] = useState({
        optionsVisible: false,
        selectValues: [],
        shownOptions: [...voiceChannelsSorted],
        searchText: ''
    });

    const toggleVcOptionsVisible = () => {
        toggleMenuVisibility(setVcSelectObj);
    }

    const updateVcSelectValues = (isActive, value) => {
        updateMenuSelectedValues(isActive, setVcSelectObj, value, true);
    }

    const updateVcSearchText = (value) => {
        updateMenuChannelSearchText(voiceChannelsSorted, setVcSelectObj, value);
    }

    const [ tcSelectObj, setTcSelectObj ] = useState({
        optionsVisible: false,
        selectValues: [],
        shownOptions: [...textChannelsSorted],
        searchText: ''
    });

    const toggleTcOptionsVisible = () => {
        toggleMenuVisibility(setTcSelectObj);
    }

    const updateTcSelectValues = (isActive, value) => {
        updateMenuSelectedValues(isActive, setTcSelectObj, value, true);
    }

    const updateTcSearchText = (value) => {
        updateMenuChannelSearchText(textChannelsSorted, setTcSelectObj, value);
    }

    const [ lcSelectObj, setLcSelectObj ] = useState({
        optionsVisible: false,
        selectValues: [],
        shownOptions: [...textChannelsSorted],
        searchText: ''
    });

    const toggleLcOptionsVisible = () => {
        toggleMenuVisibility(setLcSelectObj);
    }

    const updateLcSelectValues = (isActive, value) => {
        updateMenuSelectedValues(isActive, setLcSelectObj, value);
    }

    const updateLcSearchText = (value) => {
        updateMenuChannelSearchText(textChannelsSorted, setLcSelectObj, value);
    }

    const toggleMenuVisibility = (setterFunction) => {
        if (!hasPerms) return;

        setterFunction(oldObj => ({
            ...oldObj,
            optionsVisible: !oldObj.optionsVisible
        }));
    }

    const updateMenuSelectedValues = (isActive, setterFunction, value, multiSelect = false) => {
        if (!hasPerms) return;
        if (!isActive) return;

        setterFunction(oldObj => ({
            ...oldObj,
            selectValues: oldObj.selectValues.includes(value) ? multiSelect ? oldObj.selectValues.filter(val => val !== value) : [] : multiSelect ? [...oldObj.selectValues, value] : [value]
        }));
    }

    const updateMenuChannelSearchText = (dataList, setterFunction, value) => {
        if (!hasPerms) return;

        const newItems = dataList.map(categoryObj => {
            const catObj = categoryObj[Object.keys(categoryObj)[0]];
            const channelsArr = categoryObj[Object.keys(categoryObj)[0]].channels;
            const channelsArrFiltered = channelsArr.filter(channelObj => channelObj.name.toLowerCase().includes(value.toLowerCase()));

            if (channelsArrFiltered) {
                if (channelsArrFiltered.length)
                    return { 
                        [Object.keys(categoryObj)[0]]: {
                            channels: channelsArrFiltered,
                            category_name:  catObj.category_name 
                        }
                    }
            }
            return null;
        }).filter(obj => obj);

        setterFunction(oldObj => ({
            ...oldObj,
            searchText: value,
            shownOptions: [...newItems]
        }))
    }

    const [ eightBallResponses, setEightBallResponses ] = useState(dbGuildInfo.eight_ball);
    const [ eightBallInput, setEightBallInput ] = useState('');

    const addEightBallResponse = (response) => {
        setEightBallResponses(oldResponses => [...oldResponses, response]);
        setEightBallInput('');
    }

    const removeEightBallResponse = (response) => {
        setEightBallResponses(oldResponses => [...oldResponses.filter(oldResponse => oldResponse != response)])
    }

    useEffect(() => {
        if (!discordInfoState.userInfo) {
            router.push('/');
            return;
        }

        if (!discordInfoState.guildInfo) {
            router.push('/');
            return;
        }
    }, [discordInfoState]);

    const guildIcon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=512` : 'https://i.robertify.me/images/rykx6.png';

    const refresh = () => {
        if (!hasPerms) return;
    }

    const discard = () => {
        if (!hasPerms) return;
    }

    const reset = () => {
        if (!hasPerms) return;
    }
    
    const logToggles = Object.keys(togglesState.log_toggles).map(key => <Toggle key={key} label={key.replaceAll('_', ' ')} isActive={togglesState.log_toggles[key]} setActive={() => toggleInnerState('log_toggles', key)} />)
    const djToggles = Object.keys(togglesState.dj_toggles).map(key => <Toggle key={key} label={key.replaceAll('_', ' ')} isActive={togglesState.dj_toggles[key]} setActive={() => toggleInnerState('dj_toggles', key)} />)

    return (
        <Layout token={token} discordInfo={discordInfoState.userInfo} title={`Robertify - ${guild.name}`} >
            <main className='serverDash'>
                <div className='serverDash--optionsContainer'>
                    <Link className='serverDash--backLink' href='/dashboard'>Go back to your servers</Link>
                    <div className='serverDash--guildBanner'>
                        <img src={guildIcon} alt='Guild Icon'></img>
                        <h1>{guild.name}</h1>
                    </div>
                    <div className='serverDash--controlPanel'>
                        {hasPerms || <div className='serverDash--noPermsOverlay'>
                            <span>You must have either the <strong className='noPerms-permission'>MANAGE SERVER</strong> or <strong className='noPerms-permission'>ADMINISTRATOR</strong> permission to configure this guild!</span>
                            <div className='serverDash--noPermsOverlay-bg'></div>
                        </div>}
                        <h2 className='serverDash--controlPanel-title'>Management</h2>
                        <div className='serverDash--controlPanel-mangement'>
                            <SelectMenu
                                title='DJ Roles'
                                subTitle='Set DJ roles'
                                menuOptions={djSelectObj.shownOptions}
                                multiSelect={true}
                                placeHolder='Select multiple roles'
                                selectValues={djSelectObj.selectValues}
                                setSelectValues={updateDjSelectValues}
                                optionsVisible={djSelectObj.optionsVisible}
                                setOptionsVisible={toggleDjOptionsVisible}
                                searchText={djSelectObj.searchText}
                                setSearchText={updateDjSearchText}
                            />
                            <SelectMenu
                                title='Restricted Voice Channels'
                                subTitle='Set Voice Channels'
                                menuOptions={vcSelectObj.shownOptions}
                                multiSelect={true}
                                placeHolder='Select multiple channels'
                                selectValues={vcSelectObj.selectValues}
                                setSelectValues={updateVcSelectValues}
                                optionsVisible={vcSelectObj.optionsVisible}
                                setOptionsVisible={toggleVcOptionsVisible}
                                searchText={vcSelectObj.searchText}
                                setSearchText={updateVcSearchText}
                                isChannelMenu={true}
                                isVoiceMenu={true}
                            />
                            <SelectMenu
                                title='Restricted Text Channels'
                                subTitle='Set Text Channels'
                                menuOptions={tcSelectObj.shownOptions}
                                multiSelect={true}
                                placeHolder='Select multiple channels'
                                selectValues={tcSelectObj.selectValues}
                                setSelectValues={updateTcSelectValues}
                                optionsVisible={tcSelectObj.optionsVisible}
                                setOptionsVisible={toggleTcOptionsVisible}
                                searchText={tcSelectObj.searchText}
                                setSearchText={updateTcSearchText}
                                isChannelMenu={true}
                            />
                            <SelectMenu
                                title='Log Channel'
                                subTitle='Set the channel for Robertify logs to be sent'
                                menuOptions={lcSelectObj.shownOptions}
                                multiSelect={false}
                                placeHolder='Select a channel'
                                selectValues={lcSelectObj.selectValues}
                                setSelectValues={updateLcSelectValues}
                                optionsVisible={lcSelectObj.optionsVisible}
                                setOptionsVisible={toggleLcOptionsVisible}
                                searchText={lcSelectObj.searchText}
                                setSearchText={updateLcSearchText}
                                isChannelMenu={true}
                            />
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>Toggles</h2>
                        <div className='serverDash--controlPanel-toggles'>
                            <Toggle label='Restricted Voice Channels' subTitle='Should Robertify only be allowed to play in specific voice channels?' isActive={togglesState.restricted_voice_channels} setActive={() => toggleState('restricted_voice_channels')} />
                            <Toggle label='Restricted Text Channels' subTitle='Should Robertify commands only be allowed to be used in a specific channel?' isActive={togglesState.restricted_text_channels} setActive={() => toggleState('restricted_text_channels')}/>
                            <Toggle label='Show Requester' subTitle='Toggle if you want the song requester to be visible in now playing messages' isActive={togglesState.show_requester} setActive={() => toggleState('show_requester')}/>
                            <Toggle label='8ball' subTitle='Toggle if you want the 8ball module to be enabled in this server' isActive={togglesState['8ball']} setActive={() => toggleState('8ball')}/>
                            <Toggle label='Polls' subTitle='Toggle if you want polls to be enabled in this server' isActive={togglesState.polls} setActive={() => toggleState('polls')}/>
                            <Toggle label='Tips' subTitle='Toggle if you want tips to be enabled in this server' isActive={togglesState.tips} setActive={() => toggleState('tips')}/>
                            <Toggle label='Vote Skips' subTitle='Toggle if you want vote skips to be enabled in this server' isActive={togglesState.vote_skips} setActive={() => toggleState('vote_skips')}/>
                            <Toggle label='Announce Messages' subTitle='Toggle if you want Now Playing messages to be announced' isActive={togglesState.announce_messages} setActive={() => toggleState('announce_messages')}/>
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>DJ Toggles</h2>
                        <div className='serverDash--controlPanel-toggles'>
                            {djToggles}
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>Log Toggles</h2>
                        <div className='serverDash--controlPanel-toggles'>
                            {logToggles}
                        </div>
                        <hr className='serverDash--divider' />
                        <h2 className='serverDash--controlPanel-title'>8ball</h2>
                        <div className='serverDash--controlPanel-8ball'>
                            <TextOptionList
                                options={eightBallResponses}
                                addOption={addEightBallResponse}
                                removeOption={removeEightBallResponse}
                                inputValue={eightBallInput}
                                setInputValue={setEightBallInput}
                                placeholder='Add an 8ball response...'
                            />
                        </div>
                        <hr className='serverDash--divider' />
                        <div className='serverDash--footer-buttons'>
                            <button className='button-md danger' onClick={reset}><img src='https://i.robertify.me/images/pup8a.png' alt='Reset Button'/>Reset</button>
                            <button className='button-md primary' onClick={refresh}><img src='https://i.robertify.me/images/v1u8p.png' alt='Refresh Button'/>Refresh</button>
                        </div>
                    </div>
                </div>
                <div className='banner-lg bg-dark sticky-bottom active'>
                    <p>Careful - You have unsaved changes!</p>
                    <div className='serverDash--unsaved-buttons'>
                        <button className='button-md secondary'><img src='https://i.robertify.me/images/pup8a.png' alt='Discard Button'/>Discard</button>
                        <button className='button-md primary'><img src='https://i.robertify.me/images/htbv7.png' alt='Save Button' />Save</button>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export async function getServerSideProps(context) {
    const info = await fetchAllDiscordUserInfo(context.req);
    const guildInfo = await fetchDiscordGuildInfo(context.req, context.params.id)
    const { access } = guildInfo;

    return {
        props: {
            token: info.props.token || null,
            userInfo: info.props.userInfo || null,
            guildInfo: info.props.guildInfo.filter(obj => obj.id === context.params.id)[0] || null,
            dbGuildInfo: {
                toggles: {
                    restricted_voice_channels: false,
                    restricted_text_channels: false,
                    '8ball': true,
                    show_requester: true,
                    announce_messages: true,
                    polls: true,
                    tips: true,
                    vote_skips: true,
                    "dj_toggles": {
                        "247": true,
                        "play": false,
                        "disconnect": true,
                        "favouritetracks": false,
                        "skip": false,
                        "seek": false,
                        "remove": false,
                        "karaoke": false,
                        "tremolo": false,
                        "search": false,
                        "loop": false,
                        "nightcore": false,
                        "join": true,
                        "lyrics": false,
                        "jump": false,
                        "vibrato": false,
                        "resume": false,
                        "move": false,
                        "nowplaying": false,
                        "previous": false,
                        "clear": false,
                        "skipto": false,
                        "8d": false,
                        "pause": false,
                        "autoplay": true,
                        "volume": false,
                        "lofi": false,
                        "rewind": false,
                        "stop": false,
                        "shuffleplay": false,
                        "shuffle": false,
                        "queue": false
                    },
                    "log_toggles": {
                        "queue_add": true,
                        "track_move": true,
                        "track_loop": true,
                        "player_pause": true,
                        "track_vote_skip": true,
                        "queue_shuffle": true,
                        "player_resume": true,
                        "volume_change": true,
                        "track_seek": true,
                        "track_previous": true,
                        "track_skip": true,
                        "track_rewind": true,
                        "bot_disconnected": true,
                        "queue_remove": true,
                        "filter_toggle": true,
                        "player_stop": true,
                        "queue_loop": true,
                        "queue_clear": true,
                        "track_jump": true
                    }
                },
                eight_ball : [
                    'Testing', 'Test again', 'Blessed again 🙏🏾'
                ]
            },
            fullGuildInfo: access ? null : guildInfo,
            hasAccess: access === false ? false : true,
            localHostName: process.env.LOCAL_API_HOSTNAME
        }
    }
}